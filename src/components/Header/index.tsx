import { DownOutlined, UpOutlined } from "@ant-design/icons";
import { Badge, Button, Flex, Input, Menu, MenuProps } from "antd";
import { FC, memo, useState } from "react";
import HeaderPhone from "../../assets/icons/HeadPhone";
import Heart from "../../assets/icons/Heart";
import Information from "../../assets/icons/Information";
import Location from "../../assets/icons/Location";
import Logo from "../../assets/icons/Logo";
import Reload from "../../assets/icons/Reload";
import ShoppingCart from "../../assets/icons/ShoppingCart";
import UserProfile from "../../assets/icons/UserProfile";
import SignIn from "../SignIn";
import CartShopping from "../CartShopping/index";
import "./header.scss";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
    {
        key: "all",
        label: "All",
        children: [],
    },
    {
        key: "laptop",
        label: "Laptop",
        children: [
            { key: "1", label: "Dell" },
            { key: "2", label: "ACER" },
            { key: "3", label: "MAC" },
            { key: "4", label: "Asus" },
            { key: "5", label: "HP" },
            { key: "6", label: "Lenovo" },
            { key: "7", label: "MSI" },
        ],
    },
    {
        key: "dt",
        label: "SmathPhone",
        children: [
            { key: "1", label: "iPhone" },
            { key: "2", label: "Samsung" },
            { key: "3", label: "Xiaomi" },
            { key: "4", label: "Oppo" },
            { key: "5", label: "Vivo" },
            { key: "6", label: "Huawei" },
            { key: "7", label: "ROG Phone" },
        ],
    },
    {
        key: "tablet",
        label: "Tablet",
        children: [
            { key: "1", label: "Apple" },
            { key: "2", label: "Samsung" },
            { key: "3", label: "Huawei" },
            { key: "4", label: "Lenovo" },
            { key: "5", label: "Microsoft" },
            { key: "6", label: "Amazon" },
            { key: "7", label: "Realme" },
        ],
    },
];

const Header: FC = memo(() => {
    const navigate = useNavigate();
    const location = useLocation();
    const pathname = location.pathname;
    const [openMenu, setOpenMenu] = useState(false);
    const [openCart, setOpenCart] = useState(false);
    const [openModalSignIn, setOpenModalSignIn] = useState(false);

    return (
        <header className="header">
            <div className="main-header">
                <Flex
                    align="center"
                    justify="space-between"
                    className="main-header--wrapper"
                >
                    <div onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
                        <Logo />
                    </div>
                    <Input.Search
                        placeholder="Search for anything"
                        allowClear
                        size="large"
                        className="input--search"
                    />
                    <Flex align="center" gap={16} className="icon--wrapper">
                        <div className="cart-wrapper" 
                            onClick={() => {
                                setOpenCart(!openCart)
                                setOpenModalSignIn(false)
                            }}
                        >
                        <Badge count={5} size="small">
                            <ShoppingCart />
                        </Badge>
                        {openCart && <CartShopping />}
                        </div>
                        <div onClick={() => navigate('/wishlist')} style={{ cursor: 'pointer' }}>
                            <Heart />
                        </div>
                        <div
                            onClick={() => {
                                setOpenCart(false);
                                setOpenModalSignIn(!openModalSignIn)
                            }}
                        >
                            <UserProfile />
                        </div>
                        <div className="signIn-modal" hidden={!openModalSignIn}>
                            <SignIn />
                        </div>
                    </Flex>
                </Flex>
            </div>
            <div className="nav-header">
                <div className="nav-header--wrapper">
                    <Flex align="flex-start" gap={12}>
                        <Flex vertical>
                            <Button
                                icon={
                                    openMenu ? <UpOutlined /> : <DownOutlined />
                                }
                                iconPosition="end"
                                onClick={() => setOpenMenu(!openMenu)}
                                className={`category--btn ${openMenu ? "open" : ""}`}
                            >
                                All Categories
                            </Button>
                            <Menu
                                mode="vertical"
                                items={items}
                                hidden={!openMenu}
                                className="category--menu"
                            />
                        </Flex>
                        <Button
                                className={pathname === "/track-order" ? "active-btn" : ""}
                                type="text"
                                icon={<Location />}
                                onClick={() => navigate("/track-order")}
                            >
                                Track Order
                        </Button>
                        <Button 
                                className={pathname === "/compare" ? "active-btn" : ""}
                                type="text" 
                                icon={<Reload />}
                                onClick={() => navigate("/compare")}
                            >
                                Compare
                        </Button>
                        <Button
                                className={pathname === "/customer-support" ? "active-btn" : ""}
                                type="text" 
                                icon={<HeaderPhone />}
                                onClick={() => navigate("/customer-support")}
                            >
                                Customer Support
                        </Button>
                        <Button 
                                className={pathname === "/need-help" ? "active-btn" : ""}
                                type="text" 
                                icon={<Information />}
                                onClick={() => navigate("/need-help")}
                            >
                                Need help
                        </Button>
                    </Flex>
                </div>
            </div>
        </header>
    );
});

export default Header;
