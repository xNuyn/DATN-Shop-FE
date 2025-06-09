import { FC, memo, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Badge, Button, Dropdown, Flex, Input, Menu, MenuProps, message } from "antd";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import HeaderPhone from "../../assets/icons/HeadPhone";
import Heart from "../../assets/icons/Heart";
import Information from "../../assets/icons/Information";
import Location from "../../assets/icons/Location";
import Logo from "../../assets/icons/Logo";
import Reload from "../../assets/icons/Reload";
import ShoppingCart from "../../assets/icons/ShoppingCart";
import UserProfile from "../../assets/icons/UserProfile";
import "./header.scss";
import { logout } from "../../services/authService";
import { getCategories } from "../../services/categoryService";
import { getMyCart } from "../../services/cartService";

interface Category {
    id: number;
    name: string;
    parent: number | null;
    children?: Category[];
}
interface CategoryItem {
  key: string;
  label: string;
  children?: CategoryItem[];
}

const buildCategoryTree = (categories: Category[] = []): Category[] => {
    if (!Array.isArray(categories)) return [];

    const map: Record<number, Category> = {};
    const tree: Category[] = [];

    categories.forEach(cat => (map[cat.id] = { ...cat, children: [] }));
    categories.forEach(cat => {
        if (cat.parent) {
            map[cat.parent]?.children?.push(map[cat.id]);
        } else {
            tree.push(map[cat.id]);
        }
    });

    return tree;
};



const Header: FC = memo(() => {

    const { SubMenu } = Menu;
    const navigate = useNavigate();
    const location = useLocation();
    const pathname = location.pathname;
    const [openMenu, setOpenMenu] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [categoryItems, setCategoryItems] = useState<CategoryItem[]>([]);
    const [keyword, setKeyword] = useState("");
    const [cartCount, setCartCount] = useState(0);

    const handleSearch = (value: string) => {
        const trimmed = value.trim();
        if (trimmed) {
            console.log('trim', trimmed);
            navigate(`/shop-page?keyword=${encodeURIComponent(trimmed)}`);
        }
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getCategories();
                console.log("Categories API response:", response);

                const categoryData: Category[] = response || [];
                const tree = buildCategoryTree(categoryData);
                const menuItems = tree.map((cat) => ({
                    key: cat.id.toString(),
                    label: cat.name,
                    children: cat.children?.map((child) => ({
                        key: child.id.toString(),
                        label: child.name,
                    })),
                }));
                setCategoryItems(menuItems);
            } catch (err) {
                console.error("Error fetching categories:", err);
            }
        };
        fetchCategories();
    }, []);


    useEffect(() => {
        const syncUser = () => {
            const storedUser = localStorage.getItem("user");
            setUser(storedUser ? JSON.parse(storedUser) : null);
        };

        syncUser();

        window.addEventListener("storage", syncUser);
        return () => window.removeEventListener("storage", syncUser);
    }, []);

    useEffect(() => {
        const fetchCartCount = async () => {
            try {
            const cartData = await getMyCart();
            const totalCount = cartData.reduce((sum: number, item: any) => sum + item.quantity, 0);
            setCartCount(totalCount);
            } catch (error) {
            console.error("Failed to fetch cart count:", error);
            }
        };

        fetchCartCount();
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
            window.location.reload();
        }
    };

    const requireLogin = (action: () => void) => {
        if (!user) {
            message.warning("Bạn cần đăng nhập để sử dụng chức năng này");
        } else {
            action();
        }
    };

    const userMenu: MenuProps["items"] = [
        {
            key: "1",
            label: <span style={{
                                display: 'block',
                                width: '100%',
                                cursor: 'pointer'
                                }} onClick={() => navigate(`/account-setting/${user?.id}`)}>Account Profile</span>,
        },
        {
            key: "2",
            label: <span style={{
                                display: 'block',
                                width: '100%',
                                cursor: 'pointer'
                                }} onClick={handleLogout}>Log out</span>,
        },
    ];

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
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        onSearch={handleSearch}
                    />
                    <Flex align="center" gap={16} className="icon--wrapper">
                        <div className="cart-wrapper" 
                            onClick={() => requireLogin(() => navigate("/shopping-cart"))}
                            style={{ cursor: "pointer" }}
                        >
                        <Badge count={cartCount} size="small">
                            <ShoppingCart />
                        </Badge>
                        </div>
                        <div 
                            onClick={() => requireLogin(() => navigate("/wishlist"))} 
                            style={{ cursor: 'pointer' }}>
                            <Heart />
                        </div>
                        <div>
                            {user ? (
                                <Dropdown menu={{ items: userMenu }} placement="bottomRight">
                                <div style={{ cursor: "pointer" }}>
                                    <UserProfile />
                                </div>
                                </Dropdown>
                            ) : (
                                <div
                                onClick={() => {
                                    navigate("/login");
                                }}
                                style={{ cursor: "pointer" }}
                                >
                                <UserProfile />
                                </div>
                            )}
                        </div>
                    </Flex>
                </Flex>
            </div>
            <div className="nav-header">
                <div className="nav-header--wrapper">
                    <Flex align="flex-start" gap={12}>
                        <Flex vertical
                            onMouseEnter={() => setOpenMenu(true)}
                            onMouseLeave={() => setOpenMenu(false)}
                        >
                            <Button
                                icon={openMenu ? <UpOutlined /> : <DownOutlined />}
                                iconPosition="end"
                                className={`category--btn ${openMenu ? "open" : ""}`}
                                onClick={() => navigate("/shop-page")}
                            >
                                All Categories
                            </Button>

                            {openMenu && (
                                <Menu
                                    mode="vertical"
                                    className="category--menu"
                                    triggerSubMenuAction="hover"
                                    onClick={({ key }) => {
                                    navigate(`/shop-page?categories=${key}`);
                                    setOpenMenu(false);
                                    }}
                                >
                                    {categoryItems.map((cat) => {
                                    if (cat.children && cat.children.length > 0) {
                                        return (
                                        <SubMenu
                                            key={cat.key}
                                            title={cat.label}
                                            onTitleClick={() => {
                                            navigate(`/shop-page?categories=${cat.key}`);
                                            setOpenMenu(false);
                                            }}
                                        >
                                            {cat.children.map((child) => (
                                            <Menu.Item key={child.key}>
                                                {child.label}
                                            </Menu.Item>
                                            ))}
                                        </SubMenu>
                                        );
                                    }
                                    return <Menu.Item key={cat.key}>{cat.label}</Menu.Item>;
                                    })}
                                </Menu>
                                )}
                        </Flex>

                        <Button
                                className={pathname === "/track-order" ? "active-btn" : ""}
                                type="text"
                                icon={<Location />}
                                onClick={() => requireLogin(() => navigate("/track-order"))}
                            >
                                Track Order
                        </Button>
                        <Button 
                                className={pathname === "/compare" ? "active-btn" : ""}
                                type="text" 
                                icon={<Reload />}
                                onClick={() => requireLogin(() => navigate("/compare"))}
                            >
                                Compare
                        </Button>
                        <Button
                                className={pathname === "/customer-support" ? "active-btn" : ""}
                                type="text" 
                                icon={<HeaderPhone />}
                                onClick={() => navigate("/customer-support")}
                            >
                                Chatbot AI
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
