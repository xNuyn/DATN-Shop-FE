import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Checkout.scss';

const Checkout = () => {
  const navigate = useNavigate();
  const handlePlaceOrder = () => {
    navigate('/success');
  };
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [cartItems, setCartItems] = useState([]);

  // Fake API Call
  useEffect(() => {
    const fetchedItems = [
      {
        id: 1,
        name: 'Canon EOS 1500D DSLR Camera Body',
        image: 'https://cdn.tgdd.vn/Products/Images/42/329144/iphone-16-pro-titan-trang.png',
        price: 370,
        quantity: 1,
      },
      {
        id: 2,
        name: 'Wired Over-Ear Gaming Headphones',
        image: 'https://cdn.tgdd.vn/Products/Images/42/329144/iphone-16-pro-titan-trang.png',
        price: 250,
        quantity: 3,
      },
    ];
    setCartItems(fetchedItems);
  }, []);

  // Tính toán
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = subtotal * 0.075; // 7.5%
  const tax = (subtotal - discount) * 0.1; // 10%
  const total = subtotal - discount + tax;

  return (
    <div className="checkout-container">
      <div className="checkout-main form-section">
        {/* Billing Form */}
        <h2>Billing Information</h2>
        <form className="billing-form">
          <div className="form-grid">
            <input type="text" placeholder="First Name" />
            <input type="text" placeholder="Last Name" />
            <input type="text" className="full-width" placeholder="Company Name (Optional)" />
            <input type="text" className="full-width" placeholder="Address" />
            <select><option>Country</option></select>
            <select><option>Region/State</option></select>
            <select><option>City</option></select>
            <input type="text" placeholder="Zip Code" />
            <input type="email" className="full-width" placeholder="Email" />
            <input type="text" className="full-width" placeholder="Phone Number" />
          </div>

          <div className="checkbox">
            <input type="checkbox" id="shipDifferent" />
            <label htmlFor="shipDifferent">Ship to a different address</label>
          </div>

          {/* Payment */}
          <h2>Payment Option</h2>
          <div className="methods">
            {['cod', 'credit'].map((method) => (
              <label key={method} className="method-radio">
                <input
                  type="radio"
                  name="payment"
                  value={method}
                  checked={paymentMethod === method}
                  onChange={() => setPaymentMethod(method)}
                />
                {method === 'cod' ? 'Cash on Delivery' : 'Debit/Credit Card'}
              </label>
            ))}
          </div>
          {paymentMethod === 'credit' && (
            <div className="card-details">
              <input type="text" className="full-width" placeholder="Name on Card" />
              <input type="text" className="full-width" placeholder="Card Number" />
              <input type="text" placeholder="Expire Date (MM/YY)" />
              <input type="text" placeholder="CVC" />
            </div>
          )}

          <h2>Additional Information</h2>
          <div className="additional-notes">
            <textarea placeholder="Notes about your order..." />
          </div>
        </form>
      </div>

      {/* Order Summary */}
      <div className="checkout-summary summary-section">
        <h3>Order Summary</h3>
        <div className="order-items">
          {cartItems.map((item) => (
            <div className="item" key={item.id}>
              <img src={item.image} alt={item.name} className="item-image" />
              <div className="info">
                <div className="details">{item.name}</div>
                <div className="price">{item.quantity} x ${item.price}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="summary-totals">
          <div className="line"><span>Sub-total:</span><span>${subtotal.toFixed(2)}</span></div>
          <div className="line"><span>Shipping:</span><span>Free</span></div>
          <div className="line"><span>Discount:</span><span>${discount.toFixed(2)}</span></div>
          <div className="line"><span>Tax:</span><span>${tax.toFixed(2)}</span></div>
          <div className="line total"><span>Total:</span><span>${total.toFixed(2)}</span></div>
        </div>
        <button className="place-order" onClick={handlePlaceOrder}>PLACE ORDER</button>
      </div>
    </div>
  );
};

export default Checkout;
