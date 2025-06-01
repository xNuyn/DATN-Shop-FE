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
  "Dưới 10 triệu",
  "10 - 15 triệu",
  "15 - 20 triệu",
  "20 - 25 triệu",
  "25 - 30 triệu",
  "Trên 30 triệu",
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

  // 1. Fetch toàn bộ categories (cả cấp 1 và 2), rồi tách ra root
  useEffect(() => {
    (async () => {
      try {
        const response = await getCategories(); // trả về tất cả category
        const raw: Category[] = response || [];
        setAllCategories(raw);

        // Lọc ra root (parent = null)
        const roots = raw.filter((cat) => cat.parent === null);
        setRootCategories(roots);
      } catch (err) {
        console.error("Không tải được full categories:", err);
      }
    })();
  }, []);

  // 2. Khi selectedCategories hoặc rootCategories thay đổi, load brandOptions
  useEffect(() => {
    if (selectedCategories.length === 0) {
      setBrandOptions([]);
      return;
    }

    (async () => {
      try {
        // Lấy list id hiện đang là root
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

  // 3. Nếu selectedBrands có id không nằm trong brandOptions, thì lọc bỏ
  useEffect(() => {
    const validBrandIds = brandOptions.map((b) => String(b.id));
    const filtered = selectedBrands.filter((id) =>
      validBrandIds.includes(id)
    );
    if (filtered.length !== selectedBrands.length) {
      onBrandChange(filtered);
    }
  }, [brandOptions]);

  // 4. Hàm xóa filter (giữ nguyên như bạn đã cài)
  const removeFilter = (value: string) => {
    // Nếu user click vào tag có label = tên category cấp 1
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

    // Nếu user click vào tag có label = tên brand (subcategory)
    const brandToRemove = brandOptions.find((b) => b.name === value);
    if (brandToRemove) {
      onBrandChange(selectedBrands.filter((id) => id !== String(brandToRemove.id)));
      return;
    }

    // Nếu user click vào giá tiền
    if (selectedPrice === value) {
      onPriceChange("");
    }
  };

  // 5. Render Active Filters với tất cả id → name từ allCategories
  const renderActiveFilters = () => {
    // 5.1. Build map id→name từ allCategories
    const idToName: Record<string, string> = {};
    allCategories.forEach((cat) => {
      idToName[String(cat.id)] = cat.name;
    });

    // 5.2. Lấy ra tất cả label để hiển thị
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
            <Radio key={price} value={price}>
              {price}
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
