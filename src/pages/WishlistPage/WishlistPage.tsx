import React from "react";
import "./WishlistPage.scss";
import DashboardSidebar from "../../components/DashboardSidebar/DashboardSidebar";

const WishlistPage: React.FC = () => {
  const wishlistItems = [
    {
      id: 1,
      name: "Bose Sport Earbuds",
      description: "Wireless Earphones - Bluetooth In Ear Headphones for Workouts and Running, Triple Black",
      image: "https://cdn.tgdd.vn/Products/Images/44/335362/macbook-air-13-inch-m4-xanh-da-troi-600x600.jpg",
      originalPrice: 1299,
      salePrice: 999,
      inStock: true,
    },
    {
      id: 2,
      name: "Simple Mobile 5G LTE Galaxy 12 Mini",
      description: "512GB Gaming Phone",
      image: "https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/311178/asus-vivobook-go-15-e1504fa-r5-nj776w-140225-100949-251-600x600.jpg",
      originalPrice: 2300,
      salePrice: 2300,
      inStock: true,
    },
    {
      id: 3,
      name: "Portable Washing Machine",
      description: "11lbs capacity Model 18NMF1AM",
      image: "https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/333886/dell-inspiron-15-3520-i5-n5i5057w1-638774726911323154-600x600.jpg",
      originalPrice: 70,
      salePrice: 70,
      inStock: true,
    },
    {
      id: 4,
      name: "TOZO T6 True Wireless Earbuds",
      description: "Bluetooth Headphones Touch Control with Wireless Charging Case IPX8 Waterproof",
      image: "https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/333430/acer-nitro-v-15-anv15-41-r2up-r5-nhqpgsv004-638774737367845195-600x600.jpg",
      originalPrice: 250,
      salePrice: 220,
      inStock: false,
    },
    {
      id: 5,
      name: "Wyze Cam Pan v2",
      description: "1080p Pan/Tilt/Zoom Wi-Fi Indoor Smart Home Camera with Color Night Vision, 2-Way Audio",
      image: "https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/326049/hp-245-g10-r5-a20tdpt-170225-110347-587-600x600.jpg",
      originalPrice: 1499.99,
      salePrice: 1499.99,
      inStock: true,
    },
  ];

  return (
    <div className="wishlist-page">
      <div className="sidebar">
        <DashboardSidebar/>
      </div>
      <div className="main-content">
        <h2>Wishlist</h2>
        <div className="wishlist-table">
          <table>
            <thead>
              <tr>
                <th>Products</th>
                <th>Price</th>
                <th>Stock Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {wishlistItems.map((item) => (
                <tr key={item.id}>
                  <td className="product-cell">
                    <img src={item.image} alt={item.name} />
                    <div className="product-info">
                      <strong>{item.name}</strong>
                      <p>{item.description}</p>
                    </div>
                  </td>
                  <td className="price-cell">
                    {item.originalPrice !== item.salePrice && (
                      <span className="original-price">${item.originalPrice}</span>
                    )}
                    <span className="sale-price">${item.salePrice}</span>
                  </td>
                  <td>
                    <span className={item.inStock ? "in-stock" : "out-of-stock"}>
                      {item.inStock ? "IN STOCK" : "OUT OF STOCK"}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button
                      className={`btn-add ${item.inStock ? "" : "disabled"}`}
                      disabled={!item.inStock}
                    >
                      ADD TO CART 🛒
                    </button>
                    <button className="btn-remove">✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
