import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  HomeOutlined, HistoryOutlined, HeartOutlined, SettingOutlined,
  LogoutOutlined, SyncOutlined, ShoppingCartOutlined, SwapOutlined
} from "@ant-design/icons";
import "./DashboardSidebar.scss";
import { logout } from "../../services/authService";

const menuItems = [
  { label: "Dashboard", icon: <HomeOutlined />, key: "dashboard", path: "/dashboard" },
  { label: "Order History", icon: <HistoryOutlined />, key: "order-history", path: "/order-history" },
  { label: "Track Order", icon: <SyncOutlined />, key: "track-order", path: "/track-order" },
  { label: "Shopping Cart", icon: <ShoppingCartOutlined />, key: "shopping-cart", path: "/shopping-cart" },
  { label: "Wishlist", icon: <HeartOutlined />, key: "wishlist", path: "/wishlist" },
  { label: "Compare", icon: <SwapOutlined />, key: "compare", path: "/compare" },
  { label: "Setting", icon: <SettingOutlined />, key: "setting", path: "/account-setting/:id" },
  { label: "Log-out", icon: <LogoutOutlined />, key: "logout", path: "/logout" },
];

const DashboardSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

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

  return (
    <div className="dashboard-sidebar">
      {menuItems.map((item) => {
        const isActive =
          item.key === "setting"
            ? location.pathname.startsWith("/account-setting")
            : location.pathname === item.path;

        return (
          <div
            key={item.key}
            className={`sidebar-item ${isActive ? "active" : ""}`}
            onClick={() => {
              if (item.key === "setting") {
                navigate(`/account-setting/${user?.id}`);
              } else if (item.key === "logout") {
                handleLogout();
              } else {
                navigate(item.path);
              }
            }}
          >
            <span className="icon">{item.icon}</span>
            <span className="label">{item.label}</span>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardSidebar;
