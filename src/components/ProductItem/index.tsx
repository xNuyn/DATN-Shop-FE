import {
    EyeOutlined,
    HeartOutlined,
    ShoppingCartOutlined,
} from "@ant-design/icons";
import { Button, Flex } from "antd";
import { FC, memo } from "react";
import "./product-item.scss";
import { useNavigate } from "react-router-dom";

interface ProductItemProps {
    id: number;
    name: string;
    description: string;
    image: string;
    price_min: number;
    price_max: number;
    categories: number;
    brands: number;
    sold_per_month: number;
}

const ProductItem: FC<ProductItemProps> = memo(
    ({ image, name, price_min, price_max, sold_per_month }) => {
       const navigate = useNavigate();

        const handleClick = () => {
            navigate(`/product-detail`);
        };
        return (
            <Flex vertical gap={12} className="product-item" onClick={handleClick} style={{ cursor: "pointer" }}>
                {/* Nếu cần hiển thị tag, bạn có thể thêm brand hoặc category */}
                {/* <span className="tag-name">{brand}</span> */}
                <span className="image--wrapper">
                    <img src={image} alt="product-image" />
                    <Flex align="center" justify="center" gap={12} className="product--btn">
                        <Button shape="circle" icon={<HeartOutlined />} />
                        <Button shape="circle" icon={<ShoppingCartOutlined />} />
                        <Button shape="circle" icon={<EyeOutlined />} />
                    </Flex>
                </span>
                <p className="product-name">{name}</p>
                <p>Đã bán/tháng: {sold_per_month}</p>
                <Flex align="center" gap={12} className="price">
                    {price_min !== price_max && (
                        <span className="new">{price_min}</span>
                    )}→
                    <span className="new">{price_max}</span>
                </Flex>
            </Flex>
        );
    }
);

export default ProductItem;
