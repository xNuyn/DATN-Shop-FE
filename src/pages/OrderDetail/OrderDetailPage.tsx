// src/pages/OrderDetailPage.tsx
import React, { useEffect, useState } from 'react';
import './OrderDetailPage.scss';
import DashboardSidebar from '../../components/DashboardSidebar/DashboardSidebar';
import { getOrderById } from '../../services/orderService';
import { createReview, CreateReviewPayload } from '../../services/reviewService';
import { useNavigate, useParams } from 'react-router-dom';
import ReviewModal from '../../components/ReviewModal/ReviewModal';

const OrderDetailPage: React.FC = () => {
  const navigate =useNavigate()
  const [order, setOrder] = useState<any>(null);
  const { id } = useParams();
  const [showModal, setShowModal] = useState(false);

  // MỚI: state lưu sub_product_id của sản phẩm được chọn để đánh giá
  const [selectedSubProductId, setSelectedSubProductId] = useState<number | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrderById(Number(id));
        setOrder(data);
      } catch (error) {
        console.error('Lỗi khi lấy đơn hàng:', error);
      }
    };

    fetchOrder();
  }, [id]);

  if (!order) return <div>Đang tải đơn hàng...</div>;

  // MỚI: map thêm field subProductId = detail.sub_product.id
  const products = order.order_details.map((detail: any) => ({
    orderDetailId: detail.id,
    subProductId: detail.sub_product.id,
    image: detail.sub_product.image,
    name: detail.sub_product.product.name,
    category: detail.sub_product.product.category,
    price: parseFloat(detail.sub_product.price),
    quantity: detail.quantity,
    idproduct: detail.sub_product.product.id,
  }));

  const billingInfo = {
    name: 'Tên người dùng',
    address: 'Địa chỉ mặc định',
    phone: 'Số điện thoại',
    email: 'Email',
  };

  // MỚI: hàm xử lý khi ReviewModal gọi onSubmit
  const handleReviewSubmit = async (data: { rating: number; feedback: string }) => {
    if (selectedSubProductId == null) {
      console.error('Không xác định được sub_product_id để gửi review');
      return;
    }

    const payload: CreateReviewPayload = {
      sub_product_id: selectedSubProductId,
      rating: data.rating,
      comment: data.feedback,
    };

    try {
      const result = await createReview(payload);
      console.log('Review vừa tạo:', result.review);
      alert('Cảm ơn bạn! Đã gửi đánh giá thành công.');
    } catch (error: any) {
      console.error('Lỗi khi gửi review:', error);
      if (error.response && error.response.data) {
        alert(error.response.data.message || 'Có lỗi xảy ra khi gửi đánh giá.');
      } else {
        alert(error.message || 'Có lỗi xảy ra khi gửi đánh giá.');
      }
    } finally {
      // Đóng modal và reset selectedSubProductId
      setShowModal(false);
      setSelectedSubProductId(null);
    }
  };

  const isCompleted = order.status?.toLowerCase() === 'completed';
  const orderNote = 'Không có ghi chú đơn hàng.';

  return (
    <div className="order-detail-page">
      <div className="sidebar">
        <DashboardSidebar />
      </div>

      <div className="main-content">
        <h2>Order Status</h2>
        <div className="status-steps">
          {['PENDING', 'PROCESSING', 'SHIPPED', 'COMPLETED', 'CANCELED'].map((status) => (
            <div
              key={status}
              className={`step ${
                status.toLowerCase() === order.status.toLowerCase() ? 'active' : ''
              }`}
            >
              {status}
            </div>
          ))}
        </div>

        <h3>
          Product ({products.length < 10 ? '0' + products.length : products.length})
        </h3>
        <table className="product-table">
          <thead>
            <tr>
              <th>REVIEWS</th>
              <th>PRODUCTS</th>
              <th>PRICE</th>
              <th>QUANTITY</th>
              <th>SUB-TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product: any) => (
              <tr key={product.orderDetailId} style={{ cursor: "pointer" }} onClick={() => navigate(`/product-detail/${product.idproduct}`)}>
                <td>
                  {isCompleted ? (
                    <a
                      href="#"
                      className="review-details"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setSelectedSubProductId(product.subProductId);
                        setShowModal(true);
                      }}
                    >
                      Đánh giá
                    </a>
                  ) : (
                    <span style={{ color: '#aaa' }}>Không khả dụng</span>
                  )}
                </td>

                <td>
                  <div className="product-info">
                    <img src={product.image} alt={product.name} />
                    <div>
                      <span className="category">{product.category}</span>
                      <p>{product.name}</p>
                    </div>
                  </div>
                </td>
                <td>
                  {product.price.toLocaleString('en-US', { maximumFractionDigits: 2 })} VNĐ
                </td>
                <td>x{product.quantity}</td>
                <td>
                  {(
                    product.price * product.quantity
                  ).toLocaleString('en-US', { maximumFractionDigits: 2 })}{' '}
                  VNĐ
                </td>
              </tr>
            ))}
          </tbody>
          {products.length > 0 && (
            <tfoot>
              <tr>
                <td colSpan={4}>
                  <strong>Discount:</strong>
                </td>
                <td>
                  {order?.discount != null
                    ? Number(order.discount).toLocaleString('en-US', {
                        maximumFractionDigits: 2,
                      })
                    : '0'}{' '}
                  VNĐ
                </td>
              </tr>
              <tr>
                <td colSpan={4}>
                  <strong>Tax:</strong>
                </td>
                <td>
                  {order?.tax != null
                    ? Number(order.tax).toLocaleString('en-US', {
                        maximumFractionDigits: 2,
                      })
                    : '0'}{' '}
                  VNĐ
                </td>
              </tr>
              <tr>
                <td colSpan={4}>
                  <strong>Total Price:</strong>
                </td>
                <td>
                  <strong>
                    {order?.total_price != null
                      ? Number(order.total_price).toLocaleString('en-US', {
                          maximumFractionDigits: 2,
                        })
                      : '0'}{' '}
                    VNĐ
                  </strong>
                </td>
              </tr>
            </tfoot>
          )}
        </table>

        {/* Gọi ReviewModal, truyền vào isOpen, onClose và onSubmit */}
        <ReviewModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedSubProductId(null);
          }}
          onSubmit={handleReviewSubmit}
        />

        <div className="info-section">
          <div className="info-box">
            <h4>Billing Address</h4>
            <p>{billingInfo.name}</p>
            <p>{billingInfo.address}</p>
            <p>Phone Number: {billingInfo.phone}</p>
            <p>Email: {billingInfo.email}</p>
          </div>
          
          <div className="info-box">
            <h4>Order Notes</h4>
            <p>{orderNote}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
