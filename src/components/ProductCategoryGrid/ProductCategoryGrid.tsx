import React, { useEffect, useState } from "react";
import "./ProductCategoryGrid.scss";
import { SubProduct, fetchTopSubProducts, SubProductTopLists } from "../../services/subproductService"; // điều chỉnh path import nếu cần
import { useNavigate } from "react-router-dom";

interface ProductItem {
  id: string;
  productId: string;
  title: string;
  price: number;
  image: string;
}

interface CategorySection {
  title: string;
  products: ProductItem[];
}

const ProductCategoryGrid: React.FC = () => {
  const navigate = useNavigate();
  const [productData, setProductData] = useState<CategorySection[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const topLists: SubProductTopLists = await fetchTopSubProducts();

        const mapSubProductsToCategory = (
          title: string,
          subProducts: SubProduct[]
        ): CategorySection => ({
          title,
          products: subProducts.map((item) => ({
            id: item.id.toString(),
            productId: item.product.id.toString(), 
            title: item.product.name,
            price: item.price,
            image: item.image || item.product.image,
          })),
        });

        const newData: CategorySection[] = [
          mapSubProductsToCategory("FLASH SALE TODAY", topLists.topDiscounts),
          mapSubProductsToCategory("BEST SELLERS", topLists.topSales),
          mapSubProductsToCategory("TOP RATED", topLists.top_rated),
          mapSubProductsToCategory("NEW ARRIVAL", topLists.topNew),
        ];

        setProductData(newData);
      } catch (error) {
        console.error("Failed to fetch subproducts:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="product-category-grid">
      {productData.map((category) => (
        <div key={category.title} className="category-column">
          <h3 className="category-title">{category.title}</h3>
          {category.products.map((product) => (
            <div key={product.id} className="product-card" style={{ cursor: "pointer" }} onClick={() => navigate(`/product-detail/${product.productId}`)}>
              <img src={product.image} alt={product.title} />
              <div className="product-info">
                <p className="product-title">{product.title}</p>
                <p className="product-price">{product.price.toLocaleString('en-US', { maximumFractionDigits: 2 })} VNĐ</p>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ProductCategoryGrid;
