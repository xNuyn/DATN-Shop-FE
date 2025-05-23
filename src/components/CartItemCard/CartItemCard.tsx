import React from "react";
import "./CartItemCard.scss";

interface CartItemCardProps {
  image: string;
  name: string;
  price: number;
  quantity?: number;
  onRemove?: () => void;
}

const CartItemCard: React.FC<CartItemCardProps> = ({
  image,
  name,
  price,
  quantity = 1,
  onRemove,
}) => {
  return (
    <div className="cart-item-card">
      <img src={image} alt={name} />
      <div className="item-info">
        <p>{name}</p>
        <span>
          {quantity} x <strong>${price.toLocaleString()}</strong>
        </span>
      </div>
      {onRemove && <span className="remove" onClick={onRemove}>×</span>}
    </div>
  );
};

export default CartItemCard;
