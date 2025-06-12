import React, { useState, useEffect  } from 'react';
import './DashboardAdmin.scss';
import {
  FaTachometerAlt,
  FaTshirt,
  FaSignOutAlt, 
  FaBoxOpen,
  FaShoppingBag,
  FaUsers,
  FaTicketAlt,
  FaStar
} from 'react-icons/fa';
import { useNavigate, useLocation  } from 'react-router-dom';
import { logout } from "../../services/authService";

const DashboardAdmin: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({
    products: false,
    roles: false,
    customers: false,
    category: false,
    sellers: false,
    coupons: false,
  });

  useEffect(() => {
    setOpenMenus({
      products: location.pathname.startsWith('/admin-product') || location.pathname.startsWith('/admin-subproduct'),
      orders:   location.pathname.startsWith('/admin-order'),
      customers: location.pathname.startsWith('/admin-customer'),
      coupons:  location.pathname.startsWith('/admin-coupon'),
    });
  }, [location.pathname]);

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
        <div className={`menu-item ${
              location.pathname === '/admin-dashboard' ? 'active' : ''
              }`} 
              onClick={() => navigate("/admin-dashboard")}>
          <FaTachometerAlt />
          <span>Dashboard</span>
        </div>
      </div>

      {/* PRODUCTS */}
      <div className="menu-group">
        <div className={`menu-item ${
            location.pathname.startsWith('/admin-product') || location.pathname.startsWith('/admin-subproduct') ? 'active' : ''
            }`} 
            onClick={() => toggleMenu('products')}>
          <FaTshirt />
          <span>Products</span>
        </div>
        {openMenus.products && (
          <div className="submenu">
            <div className={`submenu-item ${
              location.pathname === '/admin-product-list' ? 'active' : ''
              }`}
              onClick={() => navigate("/admin-product-list")}>List</div>
            <div className={`submenu-item ${
              location.pathname.startsWith('/admin-subproduct-list') ? 'active' : ''
              }`}
              onClick={() => navigate("/admin-subproduct-list")}>List SubProduct</div>
            <div className={`submenu-item ${
              location.pathname.startsWith('/admin-subproduct-edit') ? 'active' : ''
              }`}
              onClick={() => navigate("/admin-subproduct-edit/:id")}>Edit</div>
            <div className={`submenu-item ${
              location.pathname === '/admin-product-add' ? 'active' : ''
              }`}
              onClick={() => navigate("/admin-product-add")}>Add new</div>
          </div>
        )}

        {/* CATEGORY */}
        <div className={`menu-item ${
              location.pathname === '/admin-category-list' ? 'active' : ''
              }`}
              onClick={() => navigate("/admin-category-list")}>
          <FaBoxOpen />
          <span>Category</span>
        </div>

        {/* ORDER */}
        <div className={`menu-item ${
            location.pathname.startsWith('/admin-order') ? 'active' : ''
            }`}
            onClick={() => toggleMenu('orders')}>
          <FaShoppingBag />
          <span>Orders</span>
        </div>
        {openMenus.orders && (
          <div className="submenu">
            <div className={`submenu-item ${
              location.pathname === '/admin-order-list' ? 'active' : ''
              }`}
              onClick={() => navigate("/admin-order-list")}>List</div>
            <div className={`submenu-item ${
              location.pathname.startsWith('/admin-order-edit') ? 'active' : ''
              }`}
              onClick={() => navigate("/admin-order-edit/:id")}>Detail</div>
          </div>
        )}
      </div>

      {/* USERS */}
      <div className="menu-group">
        <div className="section-title">USERS</div>
        <div className={`menu-item ${
            location.pathname.startsWith('/admin-customer') ? 'active' : ''
            }`}
            onClick={() => toggleMenu('customers')}>
          <FaUsers />
          <span>Customers</span>
        </div>
        {openMenus.customers && (
          <div className="submenu">
            <div className={`submenu-item ${
              location.pathname === '/admin-customer-list' ? 'active' : ''
              }`}
              onClick={() => navigate("/admin-customer-list")}>List</div>
            <div className={`submenu-item ${
              location.pathname.startsWith('/admin-customer-detail') ? 'active' : ''
              }`}
              onClick={() => navigate("/admin-customer-detail/:id")}>Detail</div>
          </div>
        )}
      </div>

      {/* OTHER */}
      <div className="menu-group">
        <div className="section-title">OTHER</div>
        <div className={`menu-item ${
            location.pathname.startsWith('/admin-coupon') ? 'active' : ''
            }`}
            onClick={() => toggleMenu('coupons')}>
          <FaTicketAlt />
          <span>Coupons</span>
        </div>
        {openMenus.coupons && (
          <div className="submenu">
            <div className={`submenu-item ${
              location.pathname === '/admin-coupon-list' ? 'active' : ''
              }`}
              onClick={() => navigate("/admin-coupon-list")}>List</div>
            <div className={`submenu-item ${
              location.pathname === '/admin-coupon-add' ? 'active' : ''
              }`}
              onClick={() => navigate("/admin-coupon-add")}>Add New</div>
          </div>
        )}
        <div className={`menu-item ${
            location.pathname.startsWith('/admin-review') ? 'active' : ''
            }`}
            onClick={() => navigate("/admin-review")}>
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
