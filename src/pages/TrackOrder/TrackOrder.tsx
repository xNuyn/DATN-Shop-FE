import React from "react";
import { Input, Button, Form, Typography, Row, Col, message } from "antd";
import "./TrackOrder.scss";
import DashboardSidebar from "../../components/DashboardSidebar/DashboardSidebar";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

const TrackOrder: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleSubmit = (values: any) => {
    const { orderId } = values;

    if (!orderId) {
      message.error("Please enter your Order ID");
      return;
    }

    // Điều hướng trực tiếp đến trang chi tiết đơn hàng
    navigate(`/order-detail/${orderId}`);
  };


  return (
    <div className="track-order-page">
      <div className="sidebar">
        <DashboardSidebar/>
      </div>

      <div className="main-content">
        <h2>Track Order</h2>
        <Text className="description">
          To check the status of your order, please enter your Order ID and email address in the boxes below, then click on the 
          “Track Order” button. You can find your Order ID and email address in the confirmation email we sent you right after you 
          completed your order. The system will check and display the latest information update about your order, including the 
          current status, operating location and expected delivery time. If you encounter any difficulties during the research 
          process, do not hesitate to contact our customer service for support.
        </Text>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="track-order-form"
        >
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="orderId"
                label="Order ID"
                rules={[{ required: true, message: "Please enter Order ID" }]}
              >
                <Input placeholder="Order ID..." />
              </Form.Item>
            </Col>
{/* 
            <Col xs={24} md={12}>
              <Form.Item
                name="email"
                label="Email Address"
                rules={[{ required: true, message: "Please enter your email" }]}
              >
                <Input placeholder="you@example.com" />
              </Form.Item>
            </Col> */}
          </Row>

          <Button type="primary" htmlType="submit" className="btn-track">
            Track Order
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default TrackOrder;
