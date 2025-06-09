// src/pages/OrderHistoryPage/OrderHistoryPage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyOrders } from "../../services/orderService";
import Pagination from "../../components/Pagination/Pagination";
import DashboardSidebar from "../../components/DashboardSidebar/DashboardSidebar";
import "./OrderHistoryPage.scss";

interface Order {
  id: number;
  subtotal: string;
  total_price: string;
  tax: string;
  discount: string;
  shipping_cost: string;
  status: string;
  created_at: string;
  status_enum: number;
  user: number;
}

const OrderHistoryPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  // Mỗi trang hiển thị 10 orders (trùng với limit truyền vào API)
  const ORDERS_PER_PAGE = 10;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        // Gọi API với page và limit tương ứng
        const res = await getMyOrders(currentPage, ORDERS_PER_PAGE);
        // res.data chứa mảng orders của trang hiện tại
        setOrders(res.data);
        // res.meta.last_page chứa tổng số trang
        setTotalPages(res.meta.last_page);
      } catch (error) {
        console.error("Không thể lấy danh sách đơn hàng.", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
    // Luôn scroll lên trên sau khi fetch xong
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${hours}:${minutes} ${day}-${month}-${year}`;
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "PENDING":
        return "green";
      case "PROCESSING":
        return "yellow";
      case "SHIPPED":
        return "orange";
      case "COMPLETED":
        return "blue";
      case "CANCELED":
        return "red";
      default:
        return "black";
    }
  };

  return (
    <div className="order-history-page">
      <div className="sidebar">
        <DashboardSidebar />
      </div>

      <div className="main-content">
        <h2>Order History</h2>

        {isLoading ? (
          <p>Đang tải đơn hàng...</p>
        ) : orders.length === 0 ? (
          <p>Không có đơn hàng nào.</p>
        ) : (
          <>
            <table className="order-table">
              <thead>
                <tr>
                  <th>ORDER ID</th>
                  <th>STATUS</th>
                  <th>DATE</th>
                  <th>TOTAL</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td
                      style={{
                        color: getStatusColor(order.status),
                        fontWeight: "bold",
                      }}
                    >
                      {order.status.toUpperCase()}
                    </td>
                    <td>{formatDate(order.created_at)}</td>
                    <td>
                      {Number(order.total_price).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td>
                      <a
                        className="view-details"
                        onClick={() => navigate(`/order-detail/${order.id}`)}
                        style={{ cursor: "pointer" }}
                      >
                        View Details →
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page: number) => setCurrentPage(page)}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;
