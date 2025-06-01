import './ShopAll.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faHeart, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { getRootCategories, getSubCategories } from '../../services/categoryService';
import { getAllBrands } from '../../services/brandService';
import { getAllMaterials } from '../../services/materialService';
import { Product, searchProducts } from '../../services/productService';

interface FilterItem {
  id: string;
  name: string;
}
interface ActiveFilter {
  key: FilterKey;
  id: string;
  name: string;
}

const filterKeys = ['Sort By', 'Category', 'SubCategory', 'Brand', 'Material'] as const;
type FilterKey = typeof filterKeys[number];
const filters: FilterKey[] = [...filterKeys];

const ShopAll = () => {
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);
  const [categories, setCategories] = useState<FilterItem[]>([]);
  const [allSubCategories, setAllSubCategories] = useState<Record<string, FilterItem[]>>({});
  const [filteredSubCategories, setFilteredSubCategories] = useState<FilterItem[]>([]);
  const [brandFilters, setBrandFilters] = useState<FilterItem[]>([]);
  const [materialFilters, setMaterialFilters] = useState<FilterItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const location = useLocation();

  // Dữ liệu filter
  const filterData: Record<FilterKey, FilterItem[]> = {
    'Sort By': [
      // { id: 'newest', name: 'Newest' },
      // { id: 'oldest', name: 'Oldest' },
      { id: 'bestseller', name: 'Best Seller' },
      // { id: 'rating', name: 'Rating' },
      { id: 'lowtohigh', name: 'Price: Low To High' },
      { id: 'hightolow', name: 'Price: High To Low' },
    ],
    Category: categories,
    SubCategory: filteredSubCategories,
    Brand: brandFilters,
    Material: materialFilters,
  };

  // Fetch categories và subcategories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getRootCategories(); // [{id, name}, ...]
        const categoryList: FilterItem[] = res.map((cat: any) => ({ id: String(cat.id), name: cat.name }));
        const subMap: Record<string, FilterItem[]> = {};
        for (const cat of res) {
          const subs = await getSubCategories(cat.id);
          subMap[cat.name] = subs.map((sub: any) => ({ id: String(sub.id), name: sub.name }));
        }
        setCategories(categoryList);
        setAllSubCategories(subMap);
        // ban đầu show all subs
        setFilteredSubCategories(Object.values(subMap).flat());
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    const fetchBrands = async () => {
      try {
        const brands = await getAllBrands();
        const brandItems: FilterItem[] = brands.map(brand => ({
          id: brand.id.toString(),
          name: brand.name,
        }));
        setBrandFilters(brandItems);
      } catch (error) {
        console.error('Error fetching brands:', error);
      }
    };
    const fetchMaterials = async () => {
      try {
        const materials = await getAllMaterials();
        const materialItems: FilterItem[] = materials.map(material => ({
          id: material.id.toString(),
          name: material.name,
        }));
        setMaterialFilters(materialItems);
      } catch (error) {
        console.error('Error fetching materials:', error);
      }
    };

    fetchCategories();
    fetchBrands();
    fetchMaterials();
  }, []);

  // Fetch products mỗi khi activeFilters thay đổi
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Tạo đối tượng params theo interface SearchParams
        const searchParams: {
          brands?: number[];
          type_search_brand?: string;
          categories?: number[];
          type_search_category?: string;
          materials?: number[];
          type_search_material?: string;
          sort_by?: string;
          limit?: number;
        } = {};

        // 1. Xử lý Category / SubCategory
        // Nếu có SubCategory thì ưu tiên dùng SubCategory (exact), ngược lại dùng Category (parent)
        const subCategoryIds = activeFilters
          .filter((f) => f.key === 'SubCategory')
          .map((f) => Number(f.id));
        const categoryIds = activeFilters
          .filter((f) => f.key === 'Category')
          .map((f) => Number(f.id));

        if (subCategoryIds.length > 0) {
          searchParams.categories = subCategoryIds;
          searchParams.type_search_category = 'exact';
        } else if (categoryIds.length > 0) {
          searchParams.categories = categoryIds;
          searchParams.type_search_category = 'parent';
        }

        // 2. Xử lý Brand
        const brandIds = activeFilters
          .filter((f) => f.key === 'Brand')
          .map((f) => Number(f.id));
        if (brandIds.length > 0) {
          searchParams.brands = brandIds;
          searchParams.type_search_brand = 'exact';
        }

        // 3. Xử lý Material
        const materialIds = activeFilters
          .filter((f) => f.key === 'Material')
          .map((f) => Number(f.id));
        if (materialIds.length > 0) {
          searchParams.materials = materialIds;
          searchParams.type_search_material = 'exact';
        }

        // 4. Xử lý Sort By
        const sortFilter = activeFilters.find((f) => f.key === 'Sort By');
        if (sortFilter) {
          // sortFilter.id có thể là 'lowtohigh' hoặc 'hightolow' hoặc 'bestseller'
          searchParams.sort_by = sortFilter.id;
        }

        // 5. Giới hạn số bản ghi mỗi trang (nếu muốn)
        searchParams.limit = 10;

        // Gọi API với params đã xây dựng
        const productsData: Product[] = await searchProducts(searchParams);
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [activeFilters]);


  // Lấy filters từ URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const raw = params.get('filters');
    if (raw) {
      const pairs = raw.split(',');
      const newActive: ActiveFilter[] = [];
      const newOpen: Record<string, boolean> = {};
      pairs.forEach(pair => {
        const [key, id] = pair.split(':');
        const k = key as FilterKey;
        const list = filterData[k] || [];
        const item = list.find(i => i.id === id);
        if (item) {
          newActive.push({ key: k, id: item.id, name: item.name });
          newOpen[key] = true;
        }
      });
      setActiveFilters(newActive);
      setOpenMenus(prev => ({ ...prev, ...newOpen }));
    }
  }, []);

  // Cập nhật subCategory khi thay đổi activeFilters
  useEffect(() => {
    const selectedCats = activeFilters
      .filter(f => f.key === 'Category')
      .map(f => f.name);
    if (!selectedCats.length) {
      setFilteredSubCategories(Object.values(allSubCategories).flat());
    } else {
      setFilteredSubCategories(
        selectedCats.flatMap(name => allSubCategories[name] || [])
      );
    }
  }, [activeFilters, allSubCategories]);

  const toggleMenu = (filter: string) => {
    setOpenMenus(prev => ({ ...prev, [filter]: !prev[filter] }));
  };
  const addFilter = (key: FilterKey, item: FilterItem) => {
    if (!activeFilters.find(f => f.key === key && f.id === item.id)) {
      setActiveFilters([...activeFilters, { key, id: item.id, name: item.name }]);
    }
  };
  const removeFilter = (target: ActiveFilter) => {
    setActiveFilters(
      activeFilters.filter(f => !(f.key === target.key && f.id === target.id))
    );
  };
  const clearAll = () => setActiveFilters([]);

  return (
    <div className="shop-all">
      {/* ... header, breadcrumb, hero ... */}
      <div className="shop-content">
        <aside className="filters">
          <h3>Filters</h3>
          {activeFilters.length > 0 && (
            <>
              <div className="applied-filters">
                {activeFilters.map((f, i) => (
                  <span key={i} className="filter-tag">
                    {f.name}
                    <FontAwesomeIcon icon={faXmark} onClick={() => removeFilter(f)} />
                  </span>
                ))}
              </div>
              <div className="applied-filters-actions">
                <button className="clear-btn" onClick={clearAll}>Clear All Filters</button>
                <button className="applied-btn">Applied Filters</button>
              </div>
            </>
          )}

          {filters.map(filter => (
            <div className="filter-item" key={filter}>
              <div className="filter-header" onClick={() => toggleMenu(filter)}>
                <span>{filter}</span>
                <FontAwesomeIcon icon={faPlus} />
              </div>
              {openMenus[filter] && (
                <div className="filter-options">
                  {filterData[filter].map(opt => (
                    <div
                      key={opt.id}
                      className={`option ${activeFilters.some(f => f.key === filter && f.id === opt.id) ? 'active' : ''}`}
                      onClick={() => addFilter(filter, opt)}
                    >
                      {opt.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </aside>

        <div className="product-list">
          {products.map((product, index) => (
            <div className="product-card" key={index}>
              <div className="product-image">
                <img src={product.image_url} alt={product.name} />
                <FontAwesomeIcon icon={faHeart} className="wishlist-icon" />
              </div>
              <div className="product-info">
                <div className="title">{product.name}</div>
                <div className="subtitle">{product.description}</div>
                <div className="detail">{product.detail_description}</div>
                <div className="price">
                  {product.min_price.toLocaleString()}₫ - {product.max_price.toLocaleString()}₫
                </div>
                <div className="sold">Đã bán: {product.sold_per_month}/tháng</div>
              </div>
            </div>
          ))}
          <div className="load-more">
            <button>Load More</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopAll;