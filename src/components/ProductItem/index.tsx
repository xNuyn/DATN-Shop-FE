import { Flex } from "antd";
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
    category: number;
    brands: number;
    sold_per_month: number;
    discount_percentage_max: number | null;
}

const ProductItem: FC<ProductItemProps> = memo(
    ({id, image, name, price_min, price_max, sold_per_month, discount_percentage_max,}) => {
       const navigate = useNavigate();

        const handleClick = () => {
            navigate(`/product-detail/${id}`);
        };
        return (
            <Flex vertical gap={12} className="product-item" onClick={handleClick} style={{ cursor: "pointer" }}>
                <span className="image--wrapper">
                    <img src={image} alt="product-image" />
                    {typeof discount_percentage_max === "number" && discount_percentage_max > 0 && (
                        <span className="discount-badge">
                            Discount up to {discount_percentage_max}%
                        </span>
                    )}
                </span>
                <p className="product-name">{name}</p>
                <p>Đã bán/tháng: {sold_per_month}</p>
                <Flex align="center" gap={12} className="price">
                    {price_min !== undefined && price_max !== undefined && price_min !== price_max && (
                        <>
                        <span className="new">{price_min.toLocaleString()}</span>→
                        </>
                    )}
                    {price_max !== undefined && (
                        <span className="new">{price_max.toLocaleString()}</span>
                    )}
                </Flex>
            </Flex>
        );
    }
);

export default ProductItem;
