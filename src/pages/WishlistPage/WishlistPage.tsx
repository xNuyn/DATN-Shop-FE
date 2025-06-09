import React, { useEffect, useState } from "react";
import "./WishlistPage.scss";
import DashboardSidebar from "../../components/DashboardSidebar/DashboardSidebar";
import { getWishlist, softDeleteWishlistItem } from "../../services/wishlistService";
import { addToCart } from "../../services/cartService";
import { useNavigate } from "react-router-dom";

interface WishlistItem { 
  id: number;
  sub_product: {
    id: number;
    product: {
      id: number;
      name: string;
      description: string;
      image: string;
    };
    image: string;
    old_price: number;
    price: number;
    size: string;
    color: string;
    stock: number;
  };
}

const WishlistPage: React.FC = () => {
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);

  const handleAddToCart = async (subProductId: number) => {
    try {
      await addToCart(subProductId, 1);
      alert("Đã thêm vào giỏ hàng!");
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      alert("Sản phẩm đã có trong giỏ hàng.");
    }
  };

  const handleRemoveFromWishlist = async (wishlistId: number) => {
    try {
      await softDeleteWishlistItem(wishlistId);
      setWishlistItems((prevItems) =>
        prevItems.filter((item) => item.id !== wishlistId)
      );
      alert("Đã xóa khỏi wishlist!");
    } catch (error) {
      console.error("Lỗi khi xóa wishlist:", error);
      alert("Xóa khỏi wishlist thất bại.");
    }
  };

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const data = await getWishlist();
        setWishlistItems(data);
      } catch (error) {
        console.error("Lỗi khi lấy wishlist:", error);
      }
    };

    fetchWishlist();
  }, []);

  return (
    <div className="wishlist-page">
      <div className="sidebar">
        <DashboardSidebar />
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
                <tr key={item.id} style={{ cursor: "pointer" }} onClick={() => navigate(`/product-detail/${item.sub_product.product.id}`)}>
                  <td className="product-cell">
                    <img src={item.sub_product.image} alt={item.sub_product.product.name} />
                    <div className="product-info">
                      <strong>{item.sub_product.product.name}</strong>
                      <p>{item.sub_product.color} - {item.sub_product.size}</p>
                    </div>
                  </td>
                  <td className="price-cell">
                    {(item.sub_product.old_price !== 0 && item.sub_product.old_price !== item.sub_product.price) && (
                      <div className="original-price">{item.sub_product.old_price.toLocaleString('en-US', { maximumFractionDigits: 2 })} VNĐ</div>
                    )}
                    <div className="sale-price">{item.sub_product.price.toLocaleString('en-US', { maximumFractionDigits: 2 })} VNĐ</div>
                  </td>
                  <td>
                    <span className={item.sub_product.stock > 0 ? "in-stock" : "out-of-stock"}>
                      {item.sub_product.stock > 0 ? "IN STOCK" : "OUT OF STOCK"}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button
                      className={`btn-add ${item.sub_product.stock <= 0 ? "disabled" : ""}`}
                      disabled={item.sub_product.stock <= 0}
                      onClick={(e) => {e.stopPropagation(); handleAddToCart(item.sub_product.id)}}
                    >
                      ADD TO CART 🛒
                    </button>
                    <button className="btn-remove" onClick={(e) => {e.stopPropagation(); handleRemoveFromWishlist(item.id)}}>✕</button>
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
