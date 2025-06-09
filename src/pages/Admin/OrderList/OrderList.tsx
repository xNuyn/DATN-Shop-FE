import React, { useState, useEffect } from 'react';
import './OrderList.scss';
import DashboardAdmin from '../../../components/DashboardAdmin/DashboardAdmin';
import { FaEdit, FaTrash, FaClipboardList, FaTasks, FaClock, FaTruck, FaClipboardCheck } from 'react-icons/fa';
import { getOrders, Order } from '../../../services/ordersService';

const OrderList: React.FC = () => {
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(5);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Fetch all orders once
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const resultAll = await getOrders(1, /* limit */ 1e9);
        setAllOrders(resultAll.data);
      } catch (error) {
        console.error('Failed to fetch all orders:', error);
      }
    };
    fetchAll();
  }, []);

  const statusTypes = [
    { key: 'all',        label: 'All Orders', icon: <FaClipboardList /> },
    { key: 'processing', label: 'Processing', icon: <FaTasks /> },
    { key: 'pending',    label: 'Pending',    icon: <FaClock /> },
    { key: 'shipped',    label: 'Shipped',    icon: <FaTruck /> },
    { key: 'completed',  label: 'Completed',  icon: <FaClipboardCheck /> },
    { key: 'cancel',     label: 'Canceled',   icon: <FaTrash /> }
  ];

  // Filter orders based on selected status
  const filtered = selectedStatus === 'all'
    ? allOrders
    : allOrders.filter(o => o.status.toLowerCase() === selectedStatus);

  // Pagination calculation
  const totalPages = Math.ceil(filtered.length / ordersPerPage);
  const displayedOrders = filtered.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  const handleFilter = (key: string) => {
    setSelectedStatus(key);
    setCurrentPage(1);
  };

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':  return 'completed';
      case 'cancel':     return 'canceled';
      case 'pending':    return 'pending';
      case 'processing': return 'processing';
      case 'shipped':    return 'shipped';
      default:           return '';
    }
  };

  return (
    <div className="admin-layout">
      <DashboardAdmin />
      <div className="order-list">
        {/* Thống kê tổng quan */}
        <div className="order-summary-grid">
          {statusTypes.map((item) => (
            <div
              key={item.key}
              className={`summary-box ${selectedStatus === item.key ? 'active' : ''}`}
              onClick={() => handleFilter(item.key)}
            >
              <div className="text">
                <h4>{item.label}</h4>
                <span>{
                  item.key === 'all'
                    ? allOrders.length
                    : allOrders.filter(o => o.status.toLowerCase() === item.key).length
                }</span>
              </div>
              <div className="icon">{item.icon}</div>
            </div>
          ))}
        </div>

        {/* Bảng đơn hàng */}
        <div className="order-table-container">
          <h3>{statusTypes.find(st => st.key === selectedStatus)?.label}</h3>
          <table className="order-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>User ID</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {displayedOrders.map(order => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.user}</td>
                  <td>{new Date(order.created_at).toLocaleDateString()}</td>
                  <td>{(+order.total_price).toFixed(2)}</td>
                  <td>
                    <span className={`status ${getStatusClass(order.status)}`}>{order.status}</span>
                  </td>
                  <td className="actions">
                    <button className="edit"><FaEdit /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((page) =>
                page === 1 || // luôn hiển thị trang 1
                page === totalPages || // luôn hiển thị trang cuối
                Math.abs(page - currentPage) <= 1 // hiển thị các trang xung quanh currentPage
              )
              .map((page, idx, arr) => {
                const prevPage = arr[idx - 1];
                const showDots = prevPage && page - prevPage > 1;
                return (
                  <React.Fragment key={page}>
                    {showDots && <span className="dots">...</span>}
                    <button
                      className={currentPage === page ? 'active' : ''}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  </React.Fragment>
                );
              })}

            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderList;