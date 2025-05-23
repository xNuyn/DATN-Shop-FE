import { Input, Button, Form, Typography, Row, Col, message } from "antd";
import "./TrackOrder.scss";

const { Title, Text } = Typography;

const TrackOrder = () => {
  const [form] = Form.useForm();

  const handleSubmit = (values: any) => {
    const { orderId, email } = values;
    // Gửi request API để kiểm tra đơn hàng
    console.log("Tracking order:", orderId, email);
    message.success("Tracking request sent");
  };

  return (
    <div className="track-order-page">
      <Title level={3}>Track Order</Title>
      <Text className="description">
        To track your order please enter your order ID in the input field below and press the “Track Order” button.
        This was given to you on your receipt and in the confirmation email you should have received.
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
              <Input placeholder="ID..." />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="email"
              label="Billing Email"
              rules={[
                { required: true, message: "Please enter your billing email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input placeholder="Email address" />
            </Form.Item>
          </Col>
        </Row>

        <div className="form-footer">
          <Button type="primary" htmlType="submit" size="large">
            TRACK ORDER →
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default TrackOrder;
