import React from 'react';
import './OrderDetailPage.scss';
import DashboardSidebar from '../../components/DashboardSidebar/DashboardSidebar';

const OrderDetailPage: React.FC = () => {
  const orderStatus = 'PROCESSING';
  const products = [
    {
      id: 1,
      image: 'https://cdn.tgdd.vn/Products/Images/42/329135/iphone-16-blue-600x600.png',
      name: 'Google Pixel 6 Pro - 5G Android Phone',
      category: 'SMARTPHONE',
      price: 899,
      quantity: 1,
    },
    {
      id: 2,
      image: 'https://cdn.tgdd.vn/Products/Images/42/329135/iphone-16-blue-600x600.png',
      name: 'Tech21 Evo Clear for Google Pixel 6 Pro',
      category: 'ACCESSORIES',
      price: 39,
      quantity: 1,
    },
  ];

  const billingInfo = {
    name: 'Kevin Gilbert',
    address: 'East Tejturi Bazar, Word No. 04, Road No. 13½, House no. 1320/C, Flat No. 5D, Dhaka-1200, Bangladesh',
    phone: '+1-202-555-0118',
    email: 'kevin.gilbert1@gmail.com',
  };

  const orderNote = 'Donec ac vehicula turpis. Aenean sagittis est eu arcu ornare, eget venenatis purus lobortis. Aliquam erat volutpat. Aliquam magna odio.';

  return (
    <div className="order-detail-page">
      <div className="sidebar">
        <DashboardSidebar />
      </div>

      <div className="main-content">
        <h2>Order Status</h2>
        <div className="status-steps">
          {['PENDING', 'PROCESSING', 'SHIPPED', 'COMPLETED', 'CANCELED'].map((status) => (
            <div
              key={status}
              className={`step ${status === orderStatus ? 'active' : ''} ${orderStatus === 'CANCELED' ? 'canceled' : ''}`}
            >
              {status}
            </div>
          ))}
        </div>

        <h3>Product ({products.length < 10 ? '0' + products.length : products.length})</h3>
        <table className="product-table">
          <thead>
            <tr>
              <th>PRODUCTS</th>
              <th>PRICE</th>
              <th>QUANTITY</th>
              <th>SUB-TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>
                  <div className="product-info">
                    <img src={product.image} alt={product.name} />
                    <div>
                      <span className="category">{product.category}</span>
                      <p>{product.name}</p>
                    </div>
                  </div>
                </td>
                <td>${product.price}</td>
                <td>x{product.quantity}</td>
                <td>${product.price * product.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="info-section">
          <div className="info-box">
            <h4>Billing Address</h4>
            <p>{billingInfo.name}</p>
            <p>{billingInfo.address}</p>
            <p>Phone Number: {billingInfo.phone}</p>
            <p>Email: {billingInfo.email}</p>
          </div>

          <div className="info-box">
            <h4>Shipping Address</h4>
            <p>{billingInfo.name}</p>
            <p>{billingInfo.address}</p>
            <p>Phone Number: {billingInfo.phone}</p>
            <p>Email: {billingInfo.email}</p>
          </div>

          <div className="info-box">
            <h4>Order Notes</h4>
            <p>{orderNote}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
