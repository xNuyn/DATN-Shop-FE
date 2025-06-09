import React, { useState } from 'react';
import './DashboardAdmin.scss';
import {
  FaTachometerAlt,
  FaTshirt,
  FaSignOutAlt, 
  FaTh,
  FaInfoCircle,
  FaEdit,
  FaPlus,
  FaBoxOpen,
  FaCubes,
  FaShoppingBag,
  FaCartPlus,
  FaTags,
  FaFileInvoice,
  FaUserCircle,
  FaUserCog,
  FaListAlt,
  FaUsers,
  FaStore,
  FaTicketAlt,
  FaStar
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { logout } from "../../services/authService";

const DashboardAdmin: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({
    products: true,
    roles: false,
    customers: false,
    category: false,
    sellers: false,
    coupons: false,
  });

  const handleLogout = async () => {
      try {
          const refresh_token = localStorage.getItem("refresh_token");
          if (refresh_token) {
              await logout(refresh_token);
          }
      } catch (error) {
          console.error("Logout failed:", error);
      } finally {
          localStorage.clear();
          setUser(null);
          navigate("/");
      }
  };

  const toggleMenu = (key: string) => {
    setOpenMenus(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="dashboard-admin">
      <div className="logo">
        <FaShoppingBag className="logo-icon" />
        <span className="logo-text">Shop Management</span>
      </div>

      {/* GENERAL */}
      <div className="menu-group">
        <div className="section-title">GENERAL</div>
        <div className="menu-item" onClick={() => navigate("/admin-dashboard")}>
          <FaTachometerAlt />
          <span>Dashboard</span>
        </div>
      </div>

      {/* PRODUCTS */}
      <div className="menu-group">
        <div className="menu-item" onClick={() => toggleMenu('products')}>
          <FaTshirt />
          <span>Products</span>
        </div>
        {openMenus.products && (
          <div className="submenu">
            <div className="submenu-item" onClick={() => navigate("/admin-product-list")}>List</div>
            <div className="submenu-item" onClick={() => navigate("/admin-product-edit/:id")}>Edit</div>
            <div className="submenu-item" onClick={() => navigate("/admin-product-add")}>Add new</div>
          </div>
        )}
      </div>

      {/* CATALOG */}
      <div className="menu-group">
        <div className="menu-item" onClick={() => navigate("/admin-category-list")}>
          <FaBoxOpen />
          <span>Category</span>
        </div>
        {/* <div className="menu-item">
          <FaCubes />
          <span>Inventory</span>
        </div> */}
        <div className="menu-item" onClick={() => navigate("/admin-order-list")}>
          <FaShoppingBag />
          <span>Orders</span>
        </div>
        {/* <div className="menu-item">
          <FaCartPlus />
          <span>Purchases</span>
        </div>
        <div className="menu-item">
          <FaTags />
          <span>Attributes</span>
        </div>
        <div className="menu-item">
          <FaFileInvoice />
          <span>Invoices</span>
        </div> */}
      </div>

      {/* USERS */}
      <div className="menu-group">
        <div className="section-title">USERS</div>
        {/* <div className="menu-item">
          <FaUserCircle />
          <span>Profile</span>
        </div>
        <div className="menu-item" onClick={() => toggleMenu('roles')}>
          <FaUserCog />
          <span>Roles</span>
        </div>
        {openMenus.roles && (
          <div className="submenu">
            <div className="submenu-item">Admin</div>
            <div className="submenu-item">Editor</div>
          </div>
        )}

        <div className="menu-item">
          <FaListAlt />
          <span>Permissions</span>
        </div> */}

        <div className="menu-item" onClick={() => toggleMenu('customers')}>
          <FaUsers />
          <span>Customers</span>
        </div>
        {openMenus.customers && (
          <div className="submenu">
            <div className="submenu-item" onClick={() => navigate("/admin-customer-list")}>List</div>
            <div className="submenu-item" onClick={() => navigate("/admin-customer-detail/:id")}>Detail</div>
          </div>
        )}

        {/* <div className="menu-item" onClick={() => toggleMenu('sellers')}>
          <FaStore />
          <span>Sellers</span>
        </div>
        {openMenus.sellers && (
          <div className="submenu">
            <div className="submenu-item">List</div>
            <div className="submenu-item">Verification</div>
          </div>
        )} */}
      </div>

      {/* OTHER */}
      <div className="menu-group">
        <div className="section-title">OTHER</div>
        <div className="menu-item" onClick={() => toggleMenu('coupons')}>
          <FaTicketAlt />
          <span>Coupons</span>
        </div>
        {openMenus.coupons && (
          <div className="submenu">
            <div className="submenu-item" onClick={() => navigate("/admin-coupon-list")}>List</div>
            <div className="submenu-item" onClick={() => navigate("/admin-coupon-add")}>Add New</div>
          </div>
        )}
        <div className="menu-item" onClick={() => navigate("/admin-review")}>
          <FaStar />
          <span>Reviews</span>
        </div>
      </div>

      <div className="menu-group">
        <div className="section-title">ACTION</div>
        <div className="menu-item" onClick={() => handleLogout()}>
          <FaSignOutAlt  />
          <span>Log Out</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
