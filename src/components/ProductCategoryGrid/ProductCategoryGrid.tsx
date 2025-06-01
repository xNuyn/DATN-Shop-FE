import React from "react";
import "./ProductCategoryGrid.scss";

interface ProductItem {
  id: string;
  title: string;
  price: string;
  image: string;
}

interface CategorySection {
  title: string;
  products: ProductItem[];
}

const productData: CategorySection[] = [
  {
    title: "FLASH SALE TODAY",
    products: [
      {
        id: "1",
        title: "Bose Sport Earbuds - Wireless Earphones",
        price: "$1,500",
        image: "https://cdn.tgdd.vn/Products/Images/42/329150/iphone-16-pro-max-sa-mac-thumb-600x600.jpg",
      },
      {
        id: "2",
        title: "Simple Mobile 4G LTE Prepaid Smartphone",
        price: "$1,500",
        image: "https://cdn.tgdd.vn/Products/Images/42/329150/iphone-16-pro-max-sa-mac-thumb-600x600.jpg",
      },
      {
        id: "3",
        title: "4K UHD LED Smart TV with Chromecast Built-in",
        price: "$1,500",
        image: "https://cdn.tgdd.vn/Products/Images/42/329150/iphone-16-pro-max-sa-mac-thumb-600x600.jpg",
      },
    ],
  },
  {
    title: "BEST SELLERS",
    products: [
      {
        id: "4",
        title: "Samsung Galaxy S21 5G",
        price: "$1,500",
        image: "https://cdn.tgdd.vn/Products/Images/42/335955/samsung-galaxy-s25-edge-sliver-thumb-600x600.jpg",
      },
      {
        id: "5",
        title: "Simple Mobile 5G LTE Galaxy 12 Mini",
        price: "$1,500",
        image: "https://cdn.tgdd.vn/Products/Images/42/335955/samsung-galaxy-s25-edge-sliver-thumb-600x600.jpg",
      },
      {
        id: "6",
        title: "Sony DSC-HX8 High Zoom Point & Shoot Camera",
        price: "$1,500",
        image: "https://cdn.tgdd.vn/Products/Images/42/335955/samsung-galaxy-s25-edge-sliver-thumb-600x600.jpg",
      },
    ],
  },
  {
    title: "TOP RATED",
    products: [
      {
        id: "7",
        title: "Portable Washing Machine 1.8NMF",
        price: "$1,500",
        image: "https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/42/334969/tecno-spark-30-white-thumb-638761785148564781-600x600.jpg",
      },
      {
        id: "8",
        title: "Sony DSC-HX8 High Zoom Point & Shoot Camera",
        price: "$1,500",
        image: "https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/42/334969/tecno-spark-30-white-thumb-638761785148564781-600x600.jpg",
      },
      {
        id: "9",
        title: "Dell Optiplex 7000-7480 All-in-One Monitor",
        price: "$1,500",
        image: "https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/42/334969/tecno-spark-30-white-thumb-638761785148564781-600x600.jpg",
      },
    ],
  },
  {
    title: "NEW ARRIVAL",
    products: [
      {
        id: "10",
        title: "TOZO T6 True Wireless Earbuds",
        price: "$1,500",
        image: "https://cdn.tgdd.vn/Products/Images/42/334864/iphone-16e-white-thumb-600x600.jpg",
      },
      {
        id: "11",
        title: "JBL FLIP 4 - Waterproof Bluetooth Speaker",
        price: "$1,500",
        image: "https://cdn.tgdd.vn/Products/Images/42/334864/iphone-16e-white-thumb-600x600.jpg",
      },
      {
        id: "12",
        title: "Wyze Cam Pan v2 1080p Indoor Camera",
        price: "$1,500",
        image: "https://cdn.tgdd.vn/Products/Images/42/334864/iphone-16e-white-thumb-600x600.jpg",
      },
    ],
  },
];

const ProductCategoryGrid: React.FC = () => {
  return (
    <div className="product-category-grid">
      {productData.map((category) => (
        <div key={category.title} className="category-column">
          <h3 className="category-title">{category.title}</h3>
          {category.products.map((product) => (
            <div key={product.id} className="product-card">
                <img src={product.image} alt={product.title} />
                <div className="product-info">
                    <p className="product-title">{product.title}</p>
                    <p className="product-price">{product.price}</p>
                </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ProductCategoryGrid;
