import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  HomeOutlined, HistoryOutlined, HeartOutlined, SettingOutlined,
  LogoutOutlined, SyncOutlined, ShoppingCartOutlined, SwapOutlined
} from "@ant-design/icons";
import "./DashboardSidebar.scss";

const menuItems = [
  { label: "Dashboard", icon: <HomeOutlined />, key: "dashboard", path: "/dashboard" },
  { label: "Order History", icon: <HistoryOutlined />, key: "order-history", path: "/order-history" },
  { label: "Track Order", icon: <SyncOutlined />, key: "track-order", path: "/track-order" },
  { label: "Shopping Cart", icon: <ShoppingCartOutlined />, key: "shopping-cart", path: "/shopping-cart" },
  { label: "Wishlist", icon: <HeartOutlined />, key: "wishlist", path: "/wishlist" },
  { label: "Compare", icon: <SwapOutlined />, key: "compare", path: "/compare" },
  { label: "Setting", icon: <SettingOutlined />, key: "setting", path: "/account-setting" },
  { label: "Log-out", icon: <LogoutOutlined />, key: "logout", path: "/logout" },
];

const DashboardSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="dashboard-sidebar">
      {menuItems.map((item) => {
        const isActive = location.pathname === item.path;

        return (
          <div
            key={item.key}
            className={`sidebar-item ${isActive ? "active" : ""}`}
            onClick={() => navigate(item.path)}
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
