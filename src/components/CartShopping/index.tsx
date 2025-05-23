import { Button } from "antd";
import "./CartShopping.scss";
import CartItemCard from "../CartItemCard/CartItemCard";

const CartShopping = () => {
  return (
    <div className="cart-dropdown">
      <h4>Shopping Cart (02)</h4>

      <CartItemCard
        image="https://cdn.tgdd.vn/Products/Images/44/321193/dell-inspiron-15-3520-i5-71027003-glr-2-750x500.jpg"
        name="Laptop Dell Inspiron 15 3520 i5 1235U (71027003)"
        price={1500}
        quantity={1}
        onRemove={() => console.log("Remove item 1")}
      />
      <CartItemCard
        image="https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/42/329149/iphone-16-pro-max-titan-sa-mac-2-638638962343879149-750x500.jpg"
        name="Điện thoại iPhone 16 Pro Max 256GB"
        price={269}
        quantity={2}
        onRemove={() => console.log("Remove item 2")}
      />

      <div className="subtotal">
        Sub-Total: <strong>$2,038.00 USD</strong>
      </div>
      <Button type="primary" block>
        CHECKOUT NOW →
      </Button>
      <Button block type="default">
        VIEW CART
      </Button>
    </div>
  );
};

export default CartShopping;
