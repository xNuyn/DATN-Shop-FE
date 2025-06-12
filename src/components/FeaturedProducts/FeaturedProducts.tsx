import { useState } from "react";
import ProductItem from "../ProductItem";
import "./FeaturedProducts.scss";
import { useNavigate } from "react-router-dom";

const productTabs = ["All Product", "Smart Phone", "Laptop", "Headphone", "TV"];

const sampleProducts = [
  {
    image: "https://cdn.tgdd.vn/Products/Images/42/335955/samsung-galaxy-s25-edge-sliver-thumb-600x600.jpg",
    tagName: "Hot",
    productName: "Samsung Galaxy S25",
    oldPrice: "$1200",
    newPrice: "$999",
    category: "Smart Phone"
  },
  {
    image: "https://cdn.tgdd.vn/Products/Images/42/335955/samsung-galaxy-s25-edge-sliver-thumb-600x600.jpg",
    tagName: "Hot",
    productName: "Samsung Galaxy S25",
    oldPrice: "$1200",
    newPrice: "$999",
    category: "Smart Phone"
  },{
    image: "https://cdn.tgdd.vn/Products/Images/42/335955/samsung-galaxy-s25-edge-sliver-thumb-600x600.jpg",
    tagName: "Hot",
    productName: "Samsung Galaxy S25",
    oldPrice: "$1200",
    newPrice: "$999",
    category: "Smart Phone"
  },{
    image: "https://cdn.tgdd.vn/Products/Images/42/335955/samsung-galaxy-s25-edge-sliver-thumb-600x600.jpg",
    tagName: "Hot",
    productName: "Samsung Galaxy S25",
    oldPrice: "$1200",
    newPrice: "$999",
    category: "Smart Phone"
  },{
    image: "https://cdn.tgdd.vn/Products/Images/42/335955/samsung-galaxy-s25-edge-sliver-thumb-600x600.jpg",
    tagName: "Hot",
    productName: "Samsung Galaxy S25",
    oldPrice: "$1200",
    newPrice: "$999",
    category: "Smart Phone"
  },{
    image: "https://cdn.tgdd.vn/Products/Images/42/335955/samsung-galaxy-s25-edge-sliver-thumb-600x600.jpg",
    tagName: "Hot",
    productName: "Samsung Galaxy S25",
    oldPrice: "$1200",
    newPrice: "$999",
    category: "Smart Phone"
  },
  {
    image: "https://cdn.tgdd.vn/Products/Images/44/289472/apple-macbook-air-m2-2022-xanh-den-1-2-600x600.jpg",
    tagName: "New",
    productName: "MacBook Air M2",
    newPrice: "$1299",
    category: "Laptop"
  },
  {
    image: "https://cdn.tgdd.vn/Products/Images/44/289472/apple-macbook-air-m2-2022-xanh-den-1-2-600x600.jpg",
    tagName: "New",
    productName: "MacBook Air M2",
    newPrice: "$1299",
    category: "Laptop"
  },{
    image: "https://cdn.tgdd.vn/Products/Images/44/289472/apple-macbook-air-m2-2022-xanh-den-1-2-600x600.jpg",
    tagName: "New",
    productName: "MacBook Air M2",
    newPrice: "$1299",
    category: "Laptop"
  },{
    image: "https://cdn.tgdd.vn/Products/Images/44/289472/apple-macbook-air-m2-2022-xanh-den-1-2-600x600.jpg",
    tagName: "New",
    productName: "MacBook Air M2",
    newPrice: "$1299",
    category: "Laptop"
  },{
    image: "https://cdn.tgdd.vn/Products/Images/44/289472/apple-macbook-air-m2-2022-xanh-den-1-2-600x600.jpg",
    tagName: "New",
    productName: "MacBook Air M2",
    newPrice: "$1299",
    category: "Laptop"
  },{
    image: "https://cdn.tgdd.vn/Products/Images/44/289472/apple-macbook-air-m2-2022-xanh-den-1-2-600x600.jpg",
    tagName: "New",
    productName: "MacBook Air M2",
    newPrice: "$1299",
    category: "Laptop"
  },
];

const FeaturedProducts = () => {
  const [activeTab, setActiveTab] = useState("All Product");
  const navigate = useNavigate();

  const filteredProducts = activeTab === "All Product"
    ? sampleProducts
    : sampleProducts.filter(p => p.category === activeTab);

  return (
    <div className="featured-products">
      <div className="header">
        <h2>Featured Products</h2>
        <div className="tabs">
          {productTabs.map(tab => (
            <span
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`tab ${activeTab === tab ? "active" : ""}`}
            >
              {tab}
            </span>
          ))}
        </div>
        <a className="browse-all" onClick={()=>{
            navigate("/shop-page")
        }}>
          Browse All Product →
        </a>
      </div>

      <div className="product-grid">
        {filteredProducts.slice(0, 10).map((product, index) => (
          <ProductItem
            key={product.tagName}
            id={Number(product.newPrice)}
            // name={product.name}
            // description={product.description}
            // image={product.image}
            // price_min={product.price_min}
            price_max={Number(product.newPrice)}
            // category={product.category}
            brands={Number(product.newPrice)}
            sold_per_month={Number(product.newPrice)}
            discount_percentage_max={Number(product.newPrice)}

            name={product.tagName}
            description={product.productName}
            image={product.image}
            price_min={Number(product.newPrice)}      // ép thành số
            category={Number(product.category)}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedProducts;
