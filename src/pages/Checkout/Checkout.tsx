import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Checkout.scss';
import { useBillingContext } from "../../utils/BillingContext";
import { getPaymentMethods, PaymentMethod, createPayment, PaymentRequest } from '../../services/paymentService';
import { createOrder, createOrderDetail, OrderRequest, OrderDetailRequest } from '../../services/orderService';
import { getMyCart, softDeleteCartItem } from '../../services/cartService'; 

interface CartItemBuyNow {
  id: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

interface CartItemFromShoppingCart {
  id: number;
  user: number;
  subproductId: number;
  quantity: number;
  name: string;
  image: string;
  price: number;
}

type CartItem = CartItemBuyNow | CartItemFromShoppingCart;

interface CartFromBackend {
  id: number;
  user: number;
  sub_product: {
    id: number;
  };
  quantity: number;
}

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [discountPercentage, setDiscountPercentage] = useState<number>(0);
  const { billingInfo } = useBillingContext();
  const [editBilling, setEditBilling] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    firstName: billingInfo.firstName,
    lastName: billingInfo.lastName,
    address: billingInfo.address,
    country: billingInfo.country,
    zipCode: billingInfo.zipCode,
    phone: billingInfo.phone,
    email: billingInfo.email,
  });

  useEffect(() => {
    if (location.state) {
      if (location.state.cartItems) {
        const normalized = location.state.cartItems.map((item: any) => {
          if (!item.sub_product) {
            return {
              ...item,
              sub_product: {
                id: item.subproductId || item.id,
              },
            };
          }
          return item;
        });
        setCartItems(normalized as CartItem[]);
      }
      if (location.state.discountPercentage !== undefined) {
        setDiscountPercentage(location.state.discountPercentage as number);
      }
    }
  }, [location.state]);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const data = await getPaymentMethods();
        setPaymentMethods(data);
      } catch (error) {
        console.error('Error fetching payment methods:', error);
      }
    };

    fetchPaymentMethods();
  }, []);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = subtotal * (discountPercentage / 100);
  const tax = subtotal * 0.1;
  const total = subtotal - discount + tax;
  const shippingCost = 0;

  const handlePlaceOrder = async () => {
    if (!paymentMethod) {
      alert('Vui lòng chọn phương thức thanh toán.');
      return;
    }

    try {
      console.log('cartItems from state:', cartItems);
      // 1. Tạo Order chính
      const orderPayload: OrderRequest = {
        subtotal: parseFloat(subtotal.toFixed(2)),
        tax: parseFloat(tax.toFixed(2)),
        discount: parseFloat(discount.toFixed(2)),
        shipping_cost: shippingCost,
        total_price: parseFloat(total.toFixed(2)),
      };
      const createdOrder = await createOrder(orderPayload);
      const orderId: number = createdOrder.order.id;

      // 2. Tạo OrderDetail cho từng item trong cart
      const detailPromises: Promise<any>[] = cartItems.map((item) => {
        const detailPayload: OrderDetailRequest = {
          order_id: orderId,
          sub_product_id: item.sub_product.id,  // chắc chắn tồn tại sau normalize
          quantity: item.quantity,
          price: item.price,
        };

        console.log('Tạo OrderDetail:', detailPayload); // debug payload gửi lên server

        return createOrderDetail(detailPayload);
      });
      await Promise.all(detailPromises);

      // 3. Tạo Payment
      const paymentPayload: PaymentRequest = {
        order_id: orderId,
        payment_method_id: Number(paymentMethod),
      };
      await createPayment(paymentPayload);

      // 4. Soft-delete từng subproduct trong giỏ hàng qua API
      const allCartItems: CartFromBackend[] = await getMyCart();
      console.log('allCartItems from server:', allCartItems);

      //   5.2 Chuẩn bị danh sách Promise xoá
      const deletePromises: Promise<any>[] = [];

      cartItems.forEach((item) => {
        // Trường hợp 1: item.id trùng với cart.id -> xóa ngay
        const matchByCartId = allCartItems.find((c) => c.id === item.id);
        if (matchByCartId) {
          deletePromises.push(softDeleteCartItem(matchByCartId.id));
        } else {
          // Trường hợp 2: coi item.id là sub_product_id
          const subProductId = 'sub_product' in item
            ? item.sub_product.id
            : (item as CartItemBuyNow).id;

          // Tìm tất cả cart entries có sub_product.id === subProductId
          const matchingCarts = allCartItems.filter(
            (c) => c.sub_product.id === subProductId
          );
          matchingCarts.forEach((c) => {
            deletePromises.push(softDeleteCartItem(c.id));
          });
        }
      });

      await Promise.all(deletePromises);

      // 5. Điều hướng sang trang thành công
      navigate('/success');
    } catch (error: any) {
      console.error('Lỗi khi đặt hàng:', error);
      alert('Đặt hàng thất bại. Vui lòng thử lại.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="checkout-container">
      <div className="checkout-main form-section">
        <h2>Billing Information</h2>
        {/* <form className="billing-form">
          <div className="form-grid">
            <input type="text" placeholder="First Name" value={billingInfo.firstName} readOnly />
            <input type="text" placeholder="Last Name" value={billingInfo.lastName} readOnly />
            <input type="text" className="full-width" placeholder="Address" value={billingInfo.address} readOnly />
            <input type="text" placeholder="Country/Region" value={billingInfo.country} readOnly />
            <input type="text" placeholder="Zip Code" value={billingInfo.zipCode} readOnly />
            <input type="text" className="full-width" placeholder="Phone Number" value={billingInfo.phone} readOnly />
            <input type="email" className="full-width" placeholder="Email" value={billingInfo.email} readOnly />
          </div>

          <div className="checkbox">
            <input type="checkbox" id="shipDifferent" />
            <label htmlFor="shipDifferent">Ship to a different address</label>
          </div> */}
          <form className="billing-form">
            <div className="form-grid">
              {['firstName','lastName','address','country','zipCode','phone','email'].map(field => (
                <input
                  key={field}
                  type={field === 'email' ? 'email' : 'text'}
                  name={field}
                  placeholder={field.replace(/([A-Z])/g, ' $1').trim()}
                  value={formData[field as keyof typeof formData]}
                  readOnly={!editBilling}
                  className={field === 'address' ? 'full-width' : ''}
                  onChange={handleChange}
                />
              ))}
            </div>
            <div className="checkbox">
              <input
                type="checkbox"
                id="editBilling"
                checked={editBilling}
                onChange={() => setEditBilling(!editBilling)}
              />
              <label htmlFor="editBilling">Ship to a different address / Edit Billing Info</label>
            </div>
          </form>

          <h2>Payment Option</h2>
          <div className="methods">
            {paymentMethods.map((method) => (
              <label key={method.id} className="method-radio">
                <input
                  type="radio"
                  name="payment"
                  value={method.id}
                  checked={paymentMethod === String(method.id)}
                  onChange={() => setPaymentMethod(String(method.id))}
                />
                {method.name}
              </label>
            ))}
          </div>
          {paymentMethods.find(m => m.id === Number(paymentMethod))?.name.toLowerCase() === 'credit card' && (
            <div className="card-details">
              <input type="text" className="full-width" placeholder="Name on Card" />
              <input type="text" className="full-width" placeholder="Card Number" />
              <input type="text" placeholder="Expire Date (MM/YY)" />
              <input type="text" placeholder="CVC" />
            </div>
          )}

          <h2>Additional Information</h2>
          <div className="additional-notes">
            <textarea placeholder="Notes about your order..." />
          </div>
        {/* </form> */}
      </div>

      <div className="checkout-summary summary-section">
        <h3>Order Summary</h3>
        <div className="order-items">
          {cartItems.map((item) => (
            <div className="item" key={item.id}>
              <img src={item.image} alt={item.name} className="item-image" />
              <div className="info">
                <div className="details">{item.name}</div>
                <div className="price">{item.quantity} x {item.price.toLocaleString('en-US', { maximumFractionDigits: 2 })} VNĐ</div>
              </div>
            </div>
          ))}
        </div>
        <div className="summary-totals">
          <div className="line"><span>Sub-total:</span><span>{subtotal.toLocaleString('en-US', { maximumFractionDigits: 2 })} VNĐ</span></div>
          <div className="line"><span>Shipping:</span><span>Free</span></div>
          <div className="line">
            <span>Discount({discountPercentage}%):</span>
            <span>{discount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} VNĐ</span>
          </div>
          <div className="line"><span>Tax:</span><span>{tax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} VNĐ</span></div>
          <div className="line total"><span>Total:</span><span>{total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} VNĐ</span></div>
        </div>
        <button className="place-order" onClick={handlePlaceOrder}>PLACE ORDER</button>
      </div>
    </div>
  );
};

export default Checkout;
