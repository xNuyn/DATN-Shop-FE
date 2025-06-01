// OrderSuccessPage.tsx
import React from 'react';
import './OrderSuccessPage.scss';

const OrderSuccessPage: React.FC = () => {
  return (
    <div className="order-success-page">
      {/* Success Message */}
      <div className="success-box">
        <div className="checkmark">✔</div>
        <h2>Your order is successfully place</h2>
        <p>Pellentesque sed lectus nec tortor tristique accumsan quis dictum risus. Donec volutpat mollis nulla non facilisis.</p>
        <div className="action-buttons">
          <button className="dashboard-btn">Go to Dashboard</button>
          <button className="view-order-btn">View Order</button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
