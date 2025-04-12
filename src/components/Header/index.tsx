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
import "./header.scss";

type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
    {
        key: "sub4",
        label: "Navigation Three",
        children: [
            { key: "9", label: "Option 9" },
            { key: "10", label: "Option 10" },
            { key: "11", label: "Option 11" },
            { key: "12", label: "Option 12" },
        ],
    },
];

const Header: FC = memo(() => {
    const [openMenu, setOpenMenu] = useState(false);

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
                    <Flex align="flex-start" gap={12}>
                        <Flex vertical>
                            <Button
                                icon={
                                    openMenu ? <UpOutlined /> : <DownOutlined />
                                }
                                iconPosition="end"
                                onClick={() => setOpenMenu(!openMenu)}
                                className="category--btn"
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
