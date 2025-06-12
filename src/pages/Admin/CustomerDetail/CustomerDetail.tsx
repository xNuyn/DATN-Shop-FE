import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./CustomerDetail.scss";
import DashboardAdmin from "../../../components/DashboardAdmin/DashboardAdmin";
import { getUserById } from "../../../services/userService";
import { getOrdersByUser, Order, PaginatedOrders } from "../../../services/orderService";

interface User {
  id: number;
  full_name: string;
  user_name: string;
  username?: string;
  avatar?: string;
  email: string;
  phone: string;
  address?: string;
  zip_code?: string;
  region?: string;
  refresh_token: string;
}

const itemsPerPage = 5;

const CustomerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const userId = Number(id);

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [orders, setOrders] = useState<Order[]>([]);
  const [orderMeta, setOrderMeta] = useState<PaginatedOrders["meta"] | null>(null);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [orderPage, setOrderPage] = useState(1);

  const formatDate = (iso: string): string => {
    const d = new Date(iso);
    const formatted = d.toLocaleDateString("en-GB", {
      day:   "2-digit",
      month: "short",
      year:  "numeric",
    });
    const [day, month, year] = formatted.split(" ");
    return `${day} ${month}, ${year}`;
  };

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const data = await getUserById(Number(id));
        setUser(data);
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  useEffect(() => {
    if (!id) return;
    setLoadingOrders(true);
    (async () => {
      try {
        const { data, meta } = await getOrdersByUser(userId, orderPage, itemsPerPage);
        setOrders(data);
        setOrderMeta(meta);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingOrders(false);
      }
    })();
  }, [id, orderPage]);

  const totalInvoices = orderMeta?.total ?? 0;
  
  const totalExpense = orders.reduce(
    (sum, o) => sum + parseFloat(o.total_price),
    0
  );

  const totalItems = orders.reduce((sum, o) => {
    const qtyInOrder = o.order_details?.reduce((s, d) => s + d.quantity, 0) ?? 0;
    return sum + qtyInOrder;
  }, 0);

  if (loading) {
    return (
      <div className="admin-layout">
        <DashboardAdmin />
        <div className="customer-detail">
          <h2>Loading customer...</h2>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="admin-layout">
        <DashboardAdmin />
        <div className="customer-detail">
          <h2>User not found</h2>
        </div>
      </div>
    );
  }

  const isActive = user.refresh_token !== "";

  return (
    <div className="admin-layout">
      <DashboardAdmin />
      <div className="customer-detail">
        <h2>CUSTOMER DETAILS</h2>

        <div className="main-content">
          {/* Left panel */}
          <div className="left-panel">
            <div className="profile-card">
              <div className="banner" />
              <div className="avatar-wrapper">
                <img
                  src={user.avatar || "https://i.pravatar.cc/100?img=1"}
                  alt={user.full_name}
                  className="avatar"
                />
              </div>
              <div className="info">
                <h3>
                  {user.full_name} <span className="verified">✔</span>
                </h3>
                <p className="username">
                  @{user.user_name || user.full_name.split(" ")[0].toLowerCase()}
                </p>
                <p><strong>Email :</strong> {user.email}</p>
                <p><strong>Phone :</strong> {user.phone}</p>
              </div>

              <div className="btn-group">
                <button className="icon-btn">✏️</button>
              </div>
            </div>

            <div className="customer-info-card">
              <div className="header">
                <h4>Customer Details</h4>
                <span className={`status-badge ${isActive ? 'online' : 'offline'}`}>
                  {isActive ? 'ON' : 'OFF'}
                </span>
              </div>
              <ul className="info-list">
                <li><strong>Account ID :</strong> <span>#{user.id}</span></li>
                <li><strong>Invoice Email :</strong> <span>{user.email}</span></li>
                <li>
                  <strong>Delivery Address :</strong>
                  <span>
                    {user.address || "N/A"}
                    {user.address && <br />}
                    {user.region || ""}
                  </span>
                </li>
                <li><strong>Zip Code :</strong> <span>{user.zip_code || "N/A"}</span></li>
                <li><strong>Region :</strong> <span>{user.region || "N/A"}</span></li>
              </ul>
            </div>
          </div>

          {/* Right panel */}
          <div className="details-panel">
            <div className="summary-widgets">
              <div className="widget">
                <div className="icon">🧾</div>
                <div>
                  <p>Total Invoice</p>
                  <strong>{totalInvoices}</strong>
                </div>
              </div>
              <div className="widget">
                <div className="icon">📦</div>
                <div>
                  <p>Total Product</p>
                  <strong>{totalItems}</strong>
                </div>
              </div>
              <div className="widget">
                <div className="icon">💰</div>
                <div>
                  <p>Total Expense</p>
                  <strong>{totalExpense.toLocaleString()}</strong>
                </div>
              </div>
            </div>

            <div className="transaction-table">
              <h4>Transaction History</h4>
              {loadingOrders ? (
                <p>Loading orders...</p>
              ) : (
                <>
                  <table>
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Status</th>
                        <th>Total Amount</th>
                        <th>Discount</th>
                        <th>Due Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((o) => (
                        <tr key={o.id}>
                          <td>#{o.id}</td>
                          <td>
                            <span className={`status ${o.status.toLowerCase()}`}>
                              {o.status}
                            </span>
                          </td>
                          <td>{o.total_price}</td>
                          <td>
                            {Number(o.discount) > 0
                              ? `${o.discount}`
                              : "No discount"}
                          </td>
                          <td>{formatDate(o.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* pagination */}
                  {orderMeta && (
                    <div className="pagination">
                      <button
                        onClick={() => setOrderPage((p) => Math.max(1, p - 1))}
                        disabled={orderMeta.current_page === 1}
                      >
                        ‹
                      </button>
                      {Array.from({ length: orderMeta.last_page }, (_, i) => (
                        <button
                          key={i}
                          className={orderMeta.current_page === i + 1 ? "active" : ""}
                          onClick={() => setOrderPage(i + 1)}
                        >
                          {i + 1}
                        </button>
                      ))}
                      <button
                        onClick={() =>
                          setOrderPage((p) => Math.min(orderMeta.last_page, p + 1))
                        }
                        disabled={orderMeta.current_page === orderMeta.last_page}
                      >
                        ›
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetail;
