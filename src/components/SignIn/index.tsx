import { ArrowRightOutlined } from "@ant-design/icons";
import { Button, Flex, Form, Input, Typography } from "antd";
import { FC } from "react";
import "./signIn.scss";

const SignIn: FC = () => {
    const [form] = Form.useForm();

    return (
        <Flex vertical gap={24} className="signIn">
            <h3 className="title">Sign in to your account</h3>
            <Form name="sign-in" form={form}>
                <Flex vertical gap={24}>
                    <Form.Item
                        layout="vertical"
                        label="Email Address"
                        name="email"
                    >
                        <Input placeholder="Email Address" />
                    </Form.Item>
                    <Form.Item
                        layout="vertical"
                        label="Password"
                        name="password"
                    >
                        <Input.Password placeholder="Password" />
                    </Form.Item>
                    <Button
                        type="primary"
                        block
                        icon={<ArrowRightOutlined />}
                        iconPosition="end"
                    >
                        LOGIN
                    </Button>
                    <Typography.Text className="description">
                        Don't have account
                    </Typography.Text>
                    <Button block>CREATE ACCOUNT</Button>
                </Flex>
            </Form>
        </Flex>
    );
};

export default SignIn;
