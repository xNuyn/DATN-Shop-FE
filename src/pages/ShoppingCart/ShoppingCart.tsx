import React, { useState, useEffect  } from 'react';
import './ShoppingCart.scss';
import DashboardSidebar from "../../components/DashboardSidebar/DashboardSidebar";
import { useNavigate } from "react-router-dom";
import { getMyCart, updateCartItem, softDeleteCartItem   } from "../../services/cartService";
import { getDiscountByCode } from "../../services/couponService";

const ShoppingCart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<any[]>([]);

  const [couponCode, setCouponCode] = useState<string>("");
  const [discountPercentage, setDiscountPercentage] = useState<number>(0);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const data = await getMyCart();
        const mappedData = data.map((item: any) => ({
          id: item.id,
          name: item.sub_product.product.name + " - " + item.sub_product.color + " " + item.sub_product.size,
          price: item.sub_product.price,
          oldPrice: item.sub_product.old_price,
          quantity: item.quantity,
          image: item.sub_product.image,
          productId: item.sub_product.product.id,
          subproductId: item.sub_product.id,
        }));
        setCartItems(mappedData);
      } catch (error) {
        console.error("Failed to fetch cart items", error);
      }
    };
    fetchCart();
  }, []);

  const handleQuantityChange = (id: number, delta: number) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(item.quantity + delta, 1) }
          : item
      )
    );
  };

  const handleRemove = async (id: number) => {
    try {
      await softDeleteCartItem(id);
      setCartItems(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Failed to delete cart item:', error);
      alert('Failed to delete cart item!');
    }
  };

  const handleUpdateCart = async () => {
    try {
      await Promise.all(
        cartItems.map(item =>
          updateCartItem(item.id, item.quantity)
        )
      );
      alert('Cart updated!');
    } catch (error) {
      console.error('Failed to update cart:', error);
      alert('Failed to update cart!');
    }
  };

  const handleApplyCoupon = async () => {
    try {
      const coupon = await getDiscountByCode(couponCode);
      if (coupon && coupon.is_active) {
        const discount = parseFloat(coupon.discount_percentage);
        setDiscountPercentage(discount);
        alert("Coupon applied successfully!");
      } else {
        alert("Invalid or expired coupon.");
      }
    } catch (error) {
      alert("Failed to apply coupon.");
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discount = subtotal * (discountPercentage / 100);
  const tax = subtotal * 0.1;
  const total = subtotal - discount + tax;

  return (
    <div className="shopping-cart-page">
      <div className="sidebar">
        <DashboardSidebar />
      </div>
      <div className="cart-container">
        <div className="cart-table-section">
          <h2>Shopping Cart</h2>
          <table className="cart-table">
            <thead>
              <tr>
                <th>PRODUCTS</th>
                <th>PRICE</th>
                <th>QUANTITY</th>
                <th>SUB-TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map(item => (
                <tr key={item.id} style={{ cursor: "pointer" }} onClick={() =>navigate(`/product-detail/${item.productId}`)}>
                  <td>
                    <div className="product-info">
                      <button className="remove-btn" onClick={(e) => {e.stopPropagation(); handleRemove(item.id)}}>✖</button>
                      <img src={item.image} alt={item.name} />
                      <span>{item.name}</span>
                    </div>
                  </td>
                  <td>
                    {item.oldPrice > 0 && (
                      <span className="old-price">{item.oldPrice.toLocaleString('en-US', {  maximumFractionDigits: 2 })}</span>
                    )}
                    {item.price.toLocaleString('en-US', {  maximumFractionDigits: 2 })}
                  </td>
                  <td>
                    <div className="quantity-control">
                      <button onClick={(e) => {e.stopPropagation(); handleQuantityChange(item.id, -1)}}>-</button>
                      <input type="text" value={String(item.quantity).padStart(2, '0')} readOnly />
                      <button onClick={(e) => {e.stopPropagation(); handleQuantityChange(item.id, 1)}}>+</button>
                    </div>
                  </td>
                  <td>{(item.price * item.quantity).toLocaleString('en-US', {  maximumFractionDigits: 2 })}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="cart-buttons">
            <button className="return-btn" onClick={() => navigate("/shop-page")}>← RETURN TO SHOP</button>
            <button className="update-btn" onClick={handleUpdateCart}>UPDATE CART</button>
          </div>
        </div>

        <div className="cart-summary-section">
          <div className="card-totals">
            <h3>Card Totals</h3>
            <ul>
              <li><span>Sub-total</span><span>{subtotal.toLocaleString('en-US', {  maximumFractionDigits: 2 })} VNĐ</span></li>
              <li><span>Shipping</span><span>Free</span></li>
              <li><span>Discount</span><span>{discount.toLocaleString('en-US', {  maximumFractionDigits: 2 })} VNĐ</span></li>
              <li><span>Tax</span><span>{tax.toLocaleString('en-US', {  maximumFractionDigits: 2 })} VNĐ</span></li>
              <li className="total"><span>Total</span><span>{total.toLocaleString('en-US', {  maximumFractionDigits: 2 })} VNĐ</span></li>
            </ul>
            <button className="checkout-btn" 
                    onClick={() => navigate("/checkout", {
                      state: {
                        cartItems,
                        discountPercentage,
                    },
                  }
                )
              }
            >
              PROCEED TO CHECKOUT →
            </button>
          </div>

          <div className="coupon-code">
            <h3>Coupon Code</h3>
            <input 
              type="text" 
              placeholder="Enter code for discount"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
            />  
            <button onClick={handleApplyCoupon}>APPLY COUPON</button>
          </div>
        </div>
      </div>    
    </div>
  );
};

export default ShoppingCart;