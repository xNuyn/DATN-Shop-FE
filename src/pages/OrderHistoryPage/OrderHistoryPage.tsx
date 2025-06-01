import React, { useState } from "react";
import Pagination from "../../components/Pagination/Pagination";
import "./OrderHistoryPage.scss";
import DashboardSidebar from "../../components/DashboardSidebar/DashboardSidebar";
import ReviewModal from '../../components/ReviewModal/ReviewModal';
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const orders = [
  { id: "#96459761", status: "IN PROGRESS", date: "Dec 30, 2019 07:52", total: "$80 (5 Products)" },
  { id: "#176761767", status: "COMPLETED", date: "Dec 7, 2019 23:26", total: "$70 (4 Products)" },
  { id: "#952143862", status: "CANCELED", date: "Dec 7, 2019 23:26", total: "$2,300 (2 Products)" },
  { id: "#176761767", status: "COMPLETED", date: "Feb 2, 2020 19:28", total: "$250 (1 Products)" },
  { id: "#51746385", status: "COMPLETED", date: "Dec 30, 2019 07:52", total: "$360 (2 Products)" },
  { id: "#51746385", status: "CANCELED", date: "Dec 4, 2019 21:42", total: "$220 (7 Products)" },
  { id: "#673971743", status: "COMPLETED", date: "Feb 2, 2020 19:28", total: "$80 (1 Product)" },
  { id: "#673971743", status: "COMPLETED", date: "Mar 20, 2019 23:14", total: "$160 (1 Products)" },
  { id: "#673971743", status: "COMPLETED", date: "Dec 4, 2019 21:42", total: "$1,500 (3 Products)" },
  { id: "#673971743", status: "COMPLETED", date: "Dec 30, 2019 07:52", total: "$1,200 (19 Products)" },
  { id: "#673971743", status: "CANCELED", date: "Dec 30, 2019 05:18", total: "$1,500 (1 Product)" },
  { id: "#673971743", status: "COMPLETED", date: "Dec 30, 2019 07:52", total: "$80 (1 Product)" },
];

const OrderHistoryPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  useEffect(() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
      }, [currentPage]);
  const [showModal, setShowModal] = useState(false);
  const handleReviewSubmit = (data: { rating: number; feedback: string }) => {
    console.log('Review Submitted:', data);
    // Gọi API ở đây nếu cần
  };

  const ordersPerPage = 8;
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  const paginatedOrders = orders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "green";
      case "IN PROGRESS":
        return "orange";
      case "CANCELED":
        return "red";
      default:
        return "black";
    }
  };

  return (
    <div className="order-history-page">
      <div className="sidebar">
        <DashboardSidebar/>
      </div>

      <div className="main-content">
        <h2>Order History</h2>
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
            {paginatedOrders.map((order, index) => (
              <tr key={index}>
                <td>{order.id}</td>
                <td style={{ color: getStatusColor(order.status), fontWeight: "bold" }}>
                  {order.status}
                </td>
                <td>{order.date}</td>
                <td>{order.total}</td>
                <td>
                  <a href="#" className="view-details"
                    onClick={(e) => {
                    navigate("/order-detail")
                    e.preventDefault();
                    setShowModal(true);
                  }}
                  >
                    View Details →
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <ReviewModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleReviewSubmit}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
};

export default OrderHistoryPage;
