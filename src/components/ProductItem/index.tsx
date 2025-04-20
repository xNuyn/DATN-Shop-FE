import {
    EyeOutlined,
    HeartOutlined,
    ShoppingCartOutlined,
} from "@ant-design/icons";
import { Button, Flex } from "antd";
import { FC, memo } from "react";
import "./product-item.scss";

interface ProductItemProps {
    image: string;
    tagName?: string;
    productName: string;
    oldPrice?: string;
    newPrice: string;
}

const ProductItem: FC<ProductItemProps> = memo(
    ({ image, tagName, productName, oldPrice, newPrice }) => {
        return (
            <Flex vertical gap={12} className="product-item">
                {tagName && <span className="tag-name">{tagName}</span>}
                <span className="image--wrapper">
                    <img src={image} alt="product-image" />
                    <Flex align="center" justify="center" gap={12} className="product--btn">
                        <Button shape="circle" icon={<HeartOutlined />} />
                        <Button
                            shape="circle"
                            icon={<ShoppingCartOutlined />}
                        />
                        <Button shape="circle" icon={<EyeOutlined />} />
                    </Flex>
                </span>
                <p className="product-name">{productName}</p>
                <Flex align="center" gap={12} className="price">
                    {oldPrice && <span className="old">{oldPrice}</span>}
                    <span className="new">{newPrice}</span>
                </Flex>
            </Flex>
        );
    }
);

export default ProductItem;
