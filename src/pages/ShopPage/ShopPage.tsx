// pages/ShopPage.tsx
import { useState } from "react";
import { Row, Col, Typography, Select, Input } from "antd";
import ProductItem from "../../components/ProductItem";
import SidebarFilter from "../../components/SidebarFilter/SidebarFilter";
import Pagination from "../../components/Pagination/Pagination";
import "./ShopPage.scss";
import { useEffect } from "react";
import { fetchFilteredProducts, Product } from "../../services/productService";
import { useSearchParams, useNavigate } from "react-router-dom";

const PRODUCTS_PER_PAGE = 20;

const ShopPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const categoryQuery = searchParams.get("categories") || "";
    const keywordQuery = searchParams.get("keyword") || "";

    const [selectedCategories, setSelectedCategories] = useState<string[]>(categoryQuery ? [categoryQuery] : []);

    const [currentPage, setCurrentPage] = useState(1);
    const [productList, setProductList] = useState<Product[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOption, setSortOption] = useState("bestseller");

    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [selectedPrice, setSelectedPrice] = useState<string>("");

    useEffect(() => {
        if (keywordQuery) {
            setSearchTerm(keywordQuery);
        }
    }, [keywordQuery]);

    useEffect(() => {
    if (categoryQuery) {
            setSelectedCategories([categoryQuery]);
        } else {
            setSelectedCategories([]);
        }
    }, [categoryQuery]);



    useEffect(() => {
        if (selectedCategories.length > 0) {
            setSearchParams({ categories: selectedCategories[0] }); // giả sử chỉ dùng 1 category cho đơn giản
        } else {
            setSearchParams({});
        }
    }, [selectedCategories]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [currentPage]);

    useEffect(() => {
        (async () => {
        try {
            const products = await fetchFilteredProducts(
            selectedCategories,
            selectedBrands,
            selectedPrice,
            searchTerm,
            sortOption
            );
            setProductList(products);
            setCurrentPage(1); // reset trang khi thay đổi filter
        } catch (err) {
            console.error("Lỗi khi load products:", err);
        }
        })();
    }, [selectedCategories, selectedBrands, selectedPrice, searchTerm, sortOption]);

    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;
    const currentProducts = productList.slice(startIndex, endIndex);
    const totalPages = Math.ceil(productList.length / PRODUCTS_PER_PAGE);

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
                                onSearch={(value) => setSearchTerm(value)}
                            />
                            <Select value={sortOption} onChange={setSortOption} style={{ width: 200 }}>
                                <Select.Option value="bestseller">Best Selling</Select.Option>
                                <Select.Option value="lowtohigh">Price: Low to High</Select.Option>
                                <Select.Option value="hightolow">Price: High to Low</Select.Option>
                            </Select>
                        </div>
                        <div className="result-count">{productList.length.toLocaleString()} Results found</div>
                    </div>

                    <Row gutter={[16, 24]}>
                        {currentProducts.map((product) => (
                            <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
                                <ProductItem {...product} />
                            </Col>
                        ))}
                    </Row>

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </Col>
            </Row>
        </div>
    );
};

export default ShopPage;
