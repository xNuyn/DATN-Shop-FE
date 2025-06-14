import { useState, useMemo, useEffect } from "react";
import { Row, Col, Typography, Select, Input } from "antd";
import ProductItem from "../../components/ProductItem";
import SidebarFilter from "../../components/SidebarFilter/SidebarFilter";
import Pagination from "../../components/Pagination/Pagination";
import "./ShopPage.scss";
import { fetchFilteredProducts, Product, PaginatedResponse } from "../../services/productService";
import { useSearchParams, useLocation } from "react-router-dom";

const PRODUCTS_PER_PAGE = 20;

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  // URL params
  const categoryQuery = searchParams.get("categories") || "";
  const keywordQuery = searchParams.get("keyword") || "";

  // Local state
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    categoryQuery ? [categoryQuery] : []
  );
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>(keywordQuery);
  const [sortOption, setSortOption] = useState<string>("bestseller");

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [productList, setProductList] = useState<Product[]>([]);

  // Hidden filters from URL: price, brand_name, category_name
  const hiddenFilters: Record<string, string> = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const hf: Record<string, string> = {};
    ["price", "brand_name", "category_name"].forEach((key) => {
      const v = params.get(key);
      if (v) hf[key] = v;
    });
    // console.log("hf", hf);
    return hf;
  }, [location.search]);

  // Sync keyword
  useEffect(() => {
    setSearchTerm(keywordQuery);
  }, [keywordQuery]);

  // Sync category
  useEffect(() => {
    if (categoryQuery) {
      setSelectedCategories([categoryQuery]);
    } else {
      setSelectedCategories([]);
    }
  }, [categoryQuery]);

  // Update URL when selectedCategories or hiddenFilters change
  useEffect(() => {
    const params: Record<string, string> = {};
    if (selectedCategories.length > 0) {
      params.categories = selectedCategories[0];
    }
    // merge hidden filters to preserve them
    Object.assign(params, hiddenFilters);
    // set new search params
    setSearchParams(params);
  }, [selectedCategories, hiddenFilters, setSearchParams]);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  // Fetch products when filters/page change
  useEffect(() => {
    (async () => {
      try {
        const resp: PaginatedResponse = await fetchFilteredProducts(
          selectedCategories,
          selectedBrands,
          selectedPrice,
          searchTerm,
          sortOption,
          currentPage,
          PRODUCTS_PER_PAGE,
          hiddenFilters
        );

        setProductList(resp.data);
        setTotalPages(resp.meta.last_page);
      } catch (err) {
        console.error("Lỗi khi load products:", err);
      }
    })();
  }, [
    selectedCategories,
    selectedBrands,
    selectedPrice,
    searchTerm,
    sortOption,
    currentPage,
    hiddenFilters,
  ]);

  return (
    <div className="shop-page-container">
      <Row gutter={24}>
        <Col xs={0} sm={0} md={6} lg={6}>
          <SidebarFilter
            onCategoryChange={setSelectedCategories}
            onBrandChange={setSelectedBrands}
            onPriceChange={setSelectedPrice}
            selectedCategories={selectedCategories}
            selectedBrands={selectedBrands}
            selectedPrice={selectedPrice}
          />
        </Col>

        <Col xs={24} sm={24} md={18} lg={18}>
          <div className="shop-header">
            <Typography.Title level={3}>Electronics Devices</Typography.Title>
            <div className="top-bar">
              <Input.Search
                placeholder="Search for anything..."
                style={{ width: "50%" }}
                defaultValue={searchTerm}
                onSearch={(value) => {
                  setSearchTerm(value);
                  setCurrentPage(1);
                }}
              />
              <Select
                value={sortOption}
                onChange={(value) => {
                  setSortOption(value);
                  setCurrentPage(1);
                }}
                style={{ width: 200 }}
              >
                <Select.Option value="bestseller">Best Selling</Select.Option>
                <Select.Option value="lowtohigh">
                  Price: Low to High
                </Select.Option>
                <Select.Option value="hightolow">
                  Price: High to Low
                </Select.Option>
              </Select>
            </div>
            <div className="result-count">{`${respCountString(
              productList.length,
              currentPage,
              PRODUCTS_PER_PAGE
            )} Results found`}</div>
          </div>

          <Row gutter={[16, 24]}>
            {productList.map((product) => (
              <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
                <ProductItem {...product} />
              </Col>
            ))}
          </Row>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </Col>
      </Row>
    </div>
  );
};

function respCountString(
  countOnPage: number,
  currentPage: number,
  perPage: number
) {
  const start = (currentPage - 1) * perPage + 1;
  const end = start + countOnPage - 1;
  return `Showing ${start}–${end}`;
}

export default ShopPage;
