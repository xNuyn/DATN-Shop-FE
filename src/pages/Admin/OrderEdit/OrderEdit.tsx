import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./OrderEdit.scss";
import DashboardAdmin from "../../../components/DashboardAdmin/DashboardAdmin";
import { getOrderById } from "../../../services/orderService";
import { getUserById } from "../../../services/userService";
import { updateOrderStatus } from "../../../services/orderService";

interface OrderDetail {
  id: number;
  quantity: number;
  price: string;
  status_enum: number;
  sub_product: {
    price: number;
    discount_percentage: string;
    stock: number;
    product: {
      name: string;
    };
    color: string;
    size: string;
    image: string;
  };
}

interface Order {
  id: number;
  user: number;
  subtotal: string;
  discount: string;
  shipping_cost: string;
  tax: string;
  total_price: string;
  status: string;
  created_at: string;
  payment: {
    payment_method: string;
    transaction_id: string;
    status: string;
  };
  order_details: OrderDetail[];
}

interface User {
  id: number;
  avatar: string;
  full_name: string;
  email: string;
  phone?: string;
  address_billing?: string;
  note?: string;
}

const OrderEdit: React.FC = () => {   
    const params = useParams<{ orderId?: string; id?: string }>();
    const idParam = params.orderId || params.id;
    const [order, setOrder] = useState<Order | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    
    const ORDER_STATUSES = [
        { key: "pending", label: "Pending" },
        { key: "processing", label: "Processing" },
        { key: "shipped", label: "Shipped" },
        { key: "completed", label: "Completed" },
    ] as const

    type StatusKey = typeof ORDER_STATUSES[number]["key"] | "canceled";
    const [currentStatus, setCurrentStatus] = useState<StatusKey>("pending");

    useEffect(() => {
        if (!idParam) { setLoading(false); return; }
        setLoading(true);
        getOrderById(Number(idParam))
        .then((data) => {
            setOrder(data);
            setCurrentStatus(data.status as StatusKey);
            return getUserById(data.user);
        })
        .then((usr) => setUser(usr))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }, [idParam, currentStatus]);

    if (loading) return <div className="admin-layout">
        <DashboardAdmin />
        <div className="coupon-add">
            <h2>Order Edit</h2>
            Loading...
        </div>
    </div>;
    if (!order) return <div className="admin-layout">
        <DashboardAdmin />
        <div className="coupon-add">
            <h2>Order Edit</h2>
            Order not found.
        </div>
    </div>;

    const currentIndex = ORDER_STATUSES.findIndex((s) => s.key === currentStatus);

  return (
    <div className="admin-layout">
      <DashboardAdmin />
      <div className="coupon-add">
        <h2>Order Edit</h2>

        <div className="order-edit-body">
          {/* LEFT: Progress */}
          <div className="order-edit-left">
            <div className="order-progress">
              <div className="order-header">
                <span className="order-id">#{order.id}</span>
                <span className="tag paid">Paid</span>
                <span className="tag in-progress">In Progress</span>
                <span className="tag canceled">Canceled</span>
              </div>
              <div className="order-meta">
                Order / Order Details / #{order.id} –{' '}
                {new Date(order.created_at).toLocaleString()}
              </div>

              <div className="progress-steps">
                {currentStatus === "canceled" ? (
                    <div className="step canceled">
                    <div className="bar"></div>
                    <div className="label">Canceled</div>
                    </div>
                ) : (
                    ORDER_STATUSES.map((step, idx) => {
                    let statusClass = "upcoming";
                    if (idx < currentIndex) statusClass = "done";
                    else if (idx === currentIndex) statusClass = "active";

                    return (
                        <div key={step.key} className={`step ${statusClass}`}>
                        <div className="bar"></div>
                        <div className="label">{step.label}</div>
                        </div>
                    );
                    })
                )}
                </div>
            </div>

            {/* === Product List === */}
            <div className="order-products">
              <h3>Product</h3>
              <div className="products-table">
                <div className="table-header">
                  <span className="col product">Product Name & Size</span>
                  <span className="col qty">Quantity</span>
                  <span className="col price">Price</span>
                  <span className="col coupon">Discount Percentage</span>
                  <span className="col stock">Status</span>
                </div>
                {order.order_details.map((detail) => (
                  <div key={detail.id} className="table-row">
                   <div className="col product">
                     <img 
                        src={detail.sub_product.image} 
                        alt={detail.sub_product.product.name} 
                     />
                     <div className="info">
                       <div className="name">{detail.sub_product.product.name}</div>
                       <div className="size">Color: {detail.sub_product.color}</div>
                     </div>
                   </div>
                   <div className="col qty">{detail.quantity}</div>
                   <div className="col price">{detail.sub_product.price.toLocaleString('en-US', { maximumFractionDigits: 2 })}</div>
                   <div className="col amount">{parseFloat(detail.sub_product.discount_percentage).toFixed(2)}%</div>
                   <div className="col stock">
                        <span className={`tag ${detail.sub_product.stock > 0 ? "ready" : "not-ready"}`}>
                            {detail.sub_product.stock > 0 ? "Ready" : "Not Ready"}
                        </span>
                   </div>
                 </div>
               ))}
             </div>
           </div>

           <div className="order-timeline">
            <h3>Order Timeline</h3>
            <div className="timeline">
                {ORDER_STATUSES.map((st, idx) => {
                const currentIdx = ORDER_STATUSES.findIndex(s => s.key === currentStatus)
                let markerType: "done" | "active" | "upcoming" = "upcoming"
                if (idx < currentIdx) markerType = "done"
                else if (idx === currentIdx) markerType = "active"

                return (
                    <div key={st.key} className={`timeline-item ${markerType}`}>
                    <div className="marker">
                        {markerType === "done" || markerType === "active" ? "✓" : idx + 1}
                    </div>
                    <div className="content">
                        <div className="text">
                        <div className="title">{st.label}</div>
                        {markerType === "active" && currentIndex < ORDER_STATUSES.length - 1 && (
                            <button
                                className="btn primary"
                                onClick={async () => {
                                    if (currentIndex + 1 < ORDER_STATUSES.length) {
                                    const nextStatus = ORDER_STATUSES[currentIndex + 1].key;
                                    try {
                                        setLoading(true);
                                        const updatedOrder = await updateOrderStatus(order.id, nextStatus);
                                        setCurrentStatus(updatedOrder.status as StatusKey);
                                    } catch (err) {
                                        console.error('Failed to update status', err);
                                    } finally {
                                        setLoading(false);
                                    }
                                    }
                                }}
                                >
                                Move to “{ORDER_STATUSES[currentIndex + 1]?.label}”
                                </button>
                        )}
                        </div>
                        <div className="date">April 23, 2024, 09:40 am</div>
                    </div>
                    </div>
                )
                })}
            </div>
            </div>

          </div>

          {/* RIGHT: Summary */}
          <div className="order-edit-right">
            <div className="order-summary">
              <h3>Order Summary</h3>
              <ul>
                <li>
                  <span className="label">Sub Total :</span>
                  <span className="value">{parseFloat(order.subtotal).toLocaleString('en-US', { maximumFractionDigits: 2 })} VNĐ</span>
                </li>
                <li>
                  <span className="label">Discount :</span>
                  <span className="value">{parseFloat(order.discount).toLocaleString('en-US', { maximumFractionDigits: 2 })} VNĐ</span>
                </li>
                <li>
                  <span className="label">Shipping Cost :</span>
                  <span className="value">{parseFloat(order.shipping_cost).toLocaleString('en-US', { maximumFractionDigits: 2 })} VNĐ</span>
                </li>
                <li>
                  <span className="label">Estimated Tax:</span>
                  <span className="value">{parseFloat(order.tax).toLocaleString('en-US', { maximumFractionDigits: 2 })} VNĐ</span>
                </li>
              </ul>
              <div className="total">
                <span>Total Price</span>
                <span className="value">{parseFloat(order.total_price).toLocaleString('en-US', { maximumFractionDigits: 2 })} VNĐ</span>
              </div>
            </div>

            {/* === Payment Information === */}
            <div className="payment-info">
              <h3>Payment Information</h3>
              <ul className="payment-meta">
                <li>
                  <span className="label">Transaction ID :</span>
                  <span className="value">{order.payment.transaction_id}</span>
                </li>
                <li>
                  <span className="label">Payment Method:</span>
                  <span className="value">{order.payment.payment_method}</span>
                </li>
                <li>
                  <span className="label">Status Payment:</span>
                  <span className="value">{order.payment.status}</span>
                </li>
              </ul>
            </div>

           {/* === Customer Details === */}
         <div className="customer-details">
           <h3>Customer Information</h3>
           <div className="customer-header">
             <img
               src={user?.avatar || "/path/to/avatar.jpg"}
               alt="Customer Avatar"
             />
             <div className="customer-info">
               <div className="name">{user?.full_name || "-"}</div>
               <div className="email">{user?.email || "-"}</div>
             </div>
           </div>
           <ul className="details-list">
             <li>
               <span className="label">Phone</span>
               <span className="value">{user?.phone || "-"}</span>
               <span className="edit">✎</span>
             </li>
             <li>
               <span className="label">Address Billing</span>
               <div className="value">
                 {user?.address_billing ? user.address_billing.split("\n").map((line, i) => <React.Fragment key={i}>{line}<br/></React.Fragment>) : "-"}
               </div>
               <span className="edit">✎</span>
             </li>
             <li>
               <span className="label">Note</span>
               <span className="value">{user?.note}</span>
               <span className="edit">✎</span>
             </li>
           </ul>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderEdit;
