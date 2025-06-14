import { Checkbox, Typography, Radio, Tag, Space } from "antd";
import { useState, useEffect } from "react";
import "./SidebarFilter.scss";
import { getCategories, getSubCategories } from "../../services/categoryService";

interface Category {
  id: number;
  name: string;
  parent: number | null;
}

interface SidebarFilterProps {
  onCategoryChange: (cats: string[]) => void;
  onBrandChange: (brands: string[]) => void;
  onPriceChange: (price: string) => void;
  selectedCategories: string[];
  selectedBrands: string[];
  selectedPrice: string;
}

const priceOptions = [
  {
    value: "< 10000000",
    text: "Dưới 10 triệu"
  },
  {
    value: "10000000->15000000",
    text: "10 - 15 triệu"
  },
  {
    value: "15000000->20000000",
    text: "15 - 20 triệu"
  },
  {
    value: "20000000->25000000",
    text: "20 - 25 triệu"
  },
  {
    value: "25000000->30000000",
    text: "25 - 30 triệu"
  },
  {
    value: "> 30000000",
    text: "Trên 30 triệu"
  }
];

const SidebarFilter = ({
  onCategoryChange,
  onBrandChange,
  onPriceChange,
  selectedCategories,
  selectedBrands,
  selectedPrice,
}: SidebarFilterProps) => {
  const [rootCategories, setRootCategories] = useState<Category[]>([]);
  const [brandOptions, setBrandOptions] = useState<Category[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const response = await getCategories(); // trả về tất cả category
        const raw: Category[] = response || [];
        setAllCategories(raw);

        const roots = raw.filter((cat) => cat.parent === null);
        setRootCategories(roots);
      } catch (err) {
        console.error("Không tải được full categories:", err);
      }
    })();
  }, []);

  useEffect(() => {
    if (selectedCategories.length === 0) {
      setBrandOptions([]);
      return;
    }

    (async () => {
      try {
        const selectedRootIds = rootCategories
          .filter((c) => selectedCategories.includes(String(c.id)))
          .map((c) => c.id);

        const allSubs: Category[] = [];
        for (const id of selectedRootIds) {
          const subs = await getSubCategories(id);
          allSubs.push(...subs);
        }

        setBrandOptions(allSubs);
      } catch (err) {
        console.error("Không tải được subcategories:", err);
      }
    })();
  }, [selectedCategories, rootCategories]);

  useEffect(() => {
    const validBrandIds = brandOptions.map((b) => String(b.id));
    const filtered = selectedBrands.filter((id) =>
      validBrandIds.includes(id)
    );
    if (filtered.length !== selectedBrands.length) {
      onBrandChange(filtered);
    }
  }, [brandOptions]);

  const removeFilter = (value: string) => {
    const categoryToRemove = rootCategories.find((cat) => cat.name === value);
    if (categoryToRemove) {
      const newCategories = selectedCategories.filter(
        (id) => id !== String(categoryToRemove.id)
      );
      const subBrandIds = brandOptions
        .filter((brand) => brand.parent === categoryToRemove.id)
        .map((brand) => String(brand.id));
      const newBrands = selectedBrands.filter((id) => !subBrandIds.includes(id));
      onCategoryChange(newCategories);
      onBrandChange(newBrands);
      return;
    }

    const brandToRemove = brandOptions.find((b) => b.name === value);
    if (brandToRemove) {
      onBrandChange(selectedBrands.filter((id) => id !== String(brandToRemove.id)));
      return;
    }

    if (selectedPrice === value) {
      onPriceChange("");
    }
  };

  const renderActiveFilters = () => {
    const idToName: Record<string, string> = {};
    allCategories.forEach((cat) => {
      idToName[String(cat.id)] = cat.name;
    });

    const allFilters: string[] = [];
    selectedCategories.forEach((id) => {
      allFilters.push(idToName[id] || id);
    });
    selectedBrands.forEach((id) => {
      allFilters.push(idToName[id] || id);
    });
    if (selectedPrice) {
      allFilters.push(selectedPrice);
    }

    if (allFilters.length === 0) return null;

    return (
      <div className="filter-section active-filters">
        <Typography.Title level={5}>Active Filters</Typography.Title>
        <Space wrap>
          {allFilters.map((label, idx) => (
            <Tag
              closable
              key={label + idx}
              color="#ff6600"
              onClose={() => removeFilter(label)}
            >
              {label}
            </Tag>
          ))}
        </Space>
      </div>
    );
  };

  return (
    <div className="sidebar-filter">
      {renderActiveFilters()}

      {/* CATEGORY */}
      <div className="filter-section">
        <Typography.Title level={5}>CATEGORY</Typography.Title>
        <Checkbox.Group
          value={selectedCategories}
          onChange={(vals) => onCategoryChange(vals as string[])}
          style={{ display: "flex", flexDirection: "column" }}
        >
          {rootCategories.map((cat) => (
            <Checkbox key={cat.id} value={String(cat.id)}>
              {cat.name}
            </Checkbox>
          ))}
        </Checkbox.Group>
      </div>

      {/* PRICE RANGE */}
      <div className="filter-section">
        <Typography.Title level={5}>PRICE RANGE</Typography.Title>
        <Radio.Group
          value={selectedPrice}
          onChange={(e) => onPriceChange(e.target.value)}
          className="price-radio-group"
        >
          {priceOptions.map((price) => (
            <Radio key={price.value} value={price.value}>
              {price.text}
            </Radio>
          ))}
        </Radio.Group>
      </div>

      {/* POPULAR BRANDS */}
      <div className="filter-section">
        <Typography.Title level={5}>POPULAR BRANDS</Typography.Title>
        <Checkbox.Group
          value={selectedBrands}
          onChange={(vals) => onBrandChange(vals as string[])}
          style={{ display: "flex", flexDirection: "column" }}
        >
          {brandOptions.map((brand) => (
            <Checkbox key={brand.id} value={String(brand.id)}>
              {brand.name}
            </Checkbox>
          ))}
          {brandOptions.length === 0 && (
            <Typography.Text type="secondary">
              Vui lòng chọn danh mục sản phẩm!
            </Typography.Text>
          )}
        </Checkbox.Group>
      </div>
    </div>
  );
};

export default SidebarFilter;
