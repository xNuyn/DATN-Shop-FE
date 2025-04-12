import { DownOutlined } from "@ant-design/icons";
import { Badge, Button, Flex, Input } from "antd";
import { FC, memo } from "react";
import HeaderPhone from "../../assets/icons/HeadPhone";
import Heart from "../../assets/icons/Heart";
import Information from "../../assets/icons/Information";
import Location from "../../assets/icons/Location";
import Logo from "../../assets/icons/Logo";
import Reload from "../../assets/icons/Reload";
import ShoppingCart from "../../assets/icons/ShoppingCart";
import UserProfile from "../../assets/icons/UserProfile";
import "./header.scss";

const Header: FC = memo(() => {
    return (
        <header className="header">
            <div className="main-header">
                <Flex
                    align="center"
                    justify="space-between"
                    className="main-header--wrapper"
                >
                    <Logo />
                    <Input.Search
                        placeholder="Search for anything"
                        allowClear
                        size="large"
                        className="input--search"
                    />
                    <Flex align="center" gap={16} className="icon--wrapper">
                        <Badge count={5} size="small">
                            <ShoppingCart />
                        </Badge>
                        <Heart />
                        <UserProfile />
                    </Flex>
                </Flex>
            </div>
            <div className="nav-header">
                <div className="nav-header--wrapper">
                    <Flex align="center" gap={12}>
                        <Button
                            icon={<DownOutlined />}
                            iconPosition="end"
                            className="category--btn"
                        >
                            All Categories
                        </Button>
                        <Button type="text" icon={<Location />}>
                            Track Order
                        </Button>
                        <Button type="text" icon={<Reload />}>
                            Compare
                        </Button>
                        <Button type="text" icon={<HeaderPhone />}>
                            Customer Support
                        </Button>
                        <Button type="text" icon={<Information />}>
                            Need help
                        </Button>
                    </Flex>
                </div>
            </div>
        </header>
    );
});

export default Header;
