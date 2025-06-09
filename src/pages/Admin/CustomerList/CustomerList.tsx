// src/pages/Admin/CustomerList/CustomerList.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CustomerList.scss";
import DashboardAdmin from "../../../components/DashboardAdmin/DashboardAdmin";
import { getUsers, deleteUser } from "../../../services/userService";
import { FaUsers, FaBox, FaHeadset, FaReceipt } from "react-icons/fa";

const itemsPerPage = 8;

interface StatCard {
  icon: JSX.Element;
  title: string;
  value: string;
  delta: string;
  trend: "up" | "down";
}

const statsData: StatCard[] = [
  { icon: <FaUsers />,     title: "All Customers",     value: "+22.63k",    delta: "34.4%", trend: "up"   },
  { icon: <FaBox />,       title: "Orders",            value: "+4.5k",      delta: "8.1%",  trend: "down" },
  { icon: <FaHeadset />,   title: "Services Request",  value: "+1.03k",     delta: "12.6%", trend: "up"   },
  { icon: <FaReceipt />,   title: "Invoice & Payment", value: "$38,908.00", delta: "45.9%", trend: "up"   },
];

const CustomerList: React.FC = () => {
  const [users, setUsers]         = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages]   = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await getUsers(currentPage, itemsPerPage);
        setUsers(res.data);
        setTotalPages(res.meta.last_page);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [currentPage]);

  const goToDetail = (id: number) => {
    navigate(`/admin-customer-detail/${id}`);
  };

  const handleDelete = async (id: number) => {
    if (
      window.confirm(`Are you sure you want to delete user #${id}?`)
    ) {
      try {
        await deleteUser(id);
        // xoá khỏi state để UI cập nhật
        setUsers((prev) => prev.filter((c) => c.id !== id));
      } catch (err) {
        console.error("Delete failed:", err);
        alert("Failed to delete user");
      }
    }
  };

  return (
    <div className="admin-layout">
      <DashboardAdmin />

      <div className="customer-list">
        <h2>CUSTOMER LIST</h2>

        {/* Summary cards */}
        <div className="customer-summary">
          {statsData.map((s) => (
            <div key={s.title} className="summary-card">
              <div className="icon-box">{s.icon}</div>
              <div className="content">
                <h4>{s.title}</h4>
                <div className="value">{s.value}</div>
                <div className={`change ${s.trend}`}>
                  {s.trend === "up" ? "▲" : "▼"} {s.delta}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Zip Code</th>
                <th>Region</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td
                    className="customer"
                    style={{ cursor: "pointer" }}
                    onClick={() => goToDetail(u.id)}
                  >
                    <img
                      src={u.avatar || "https://via.placeholder.com/100"}
                      alt={u.full_name}
                    />
                    <span>{u.full_name}</span>
                  </td>
                  <td>{u.email}</td>
                  <td>{u.phone}</td>
                  <td>{u.address}</td>
                  <td>{u.zip_code}</td>
                  <td>{u.region || "N/A"}</td>
                  <td className="actions">
                    <button
                      className="view"
                      onClick={() => goToDetail(u.id)}
                    >
                      👁
                    </button>
                    <button className="delete" style={{ cursor: "pointer" }} onClick={() => handleDelete(u.id)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={currentPage === i + 1 ? "active" : ""}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
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

export default CustomerList;
