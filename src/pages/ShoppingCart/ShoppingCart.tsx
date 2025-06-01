import React, { useState } from 'react';
import './ShoppingCart.scss';
import DashboardSidebar from "../../components/DashboardSidebar/DashboardSidebar";
import { useNavigate } from "react-router-dom";


const ShoppingCart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: '4K UHD LED Smart TV with Chromecast Built-in',
      price: 70,
      oldPrice: 99,
      quantity: 1,
      image: 'https://cdn.tgdd.vn/Products/Images/42/323567/vivo-v30e-nau-thumb-1-600x600.jpg',
    },
    {
      id: 2,
      name: 'Wired Over-Ear Gaming Headphones with USB',
      price: 250,
      quantity: 3,
      image: 'https://cdn.tgdd.vn/Products/Images/42/323567/vivo-v30e-nau-thumb-1-600x600.jpg',
    },
  ]);

  const handleQuantityChange = (id: number, delta: number) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(item.quantity + delta, 1) }
          : item
      )
    );
  };

  const handleRemove = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleUpdateCart = () => {
    // TODO: Call API to update cart
    alert('Cart updated!');
  };

  const handleApplyCoupon = () => {
    alert('Coupon applied!');
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discount = 24;
  const tax = 61.99;
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
                <tr key={item.id}>
                  <td>
                    <div className="product-info">
                      <button className="remove-btn" onClick={() => handleRemove(item.id)}>✖</button>
                      <img src={item.image} alt={item.name} />
                      <span>{item.name}</span>
                    </div>
                  </td>
                  <td>
                    {item.oldPrice && (
                      <span className="old-price">${item.oldPrice}</span>
                    )}
                    ${item.price}
                  </td>
                  <td>
                    <div className="quantity-control">
                      <button onClick={() => handleQuantityChange(item.id, -1)}>-</button>
                      <input type="text" value={String(item.quantity).padStart(2, '0')} readOnly />
                      <button onClick={() => handleQuantityChange(item.id, 1)}>+</button>
                    </div>
                  </td>
                  <td>${item.price * item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="cart-buttons">
            <button className="return-btn">← RETURN TO SHOP</button>
            <button className="update-btn" onClick={handleUpdateCart}>UPDATE CART</button>
          </div>
        </div>

        <div className="cart-summary-section">
          <div className="card-totals">
            <h3>Card Totals</h3>
            <ul>
              <li><span>Sub-total</span><span>${subtotal}</span></li>
              <li><span>Shipping</span><span>Free</span></li>
              <li><span>Discount</span><span>${discount}</span></li>
              <li><span>Tax</span><span>${tax}</span></li>
              <li className="total"><span>Total</span><span>${total.toFixed(2)} USD</span></li>
            </ul>
            <button className="checkout-btn" onClick={() => navigate("/checkout")}>PROCEED TO CHECKOUT →</button>
          </div>

          <div className="coupon-code">
            <h3>Coupon Code</h3>
            <input type="text" placeholder="Enter code for discount" />
            <button onClick={handleApplyCoupon}>APPLY COUPON</button>
          </div>
        </div>
      </div>    
    </div>
  );
};

export default ShoppingCart;