import { ArrowRightOutlined } from "@ant-design/icons";
import { Button, Flex, Form, Input, Typography } from "antd";
import { FC } from "react";
import "./signIn.scss";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const SignIn: FC = () => {
    const [openSignIn, setOpenSignIn] = useState(true);
    const navigate = useNavigate();
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
                    {/* <Button onClick={() => navigate("/signup")} block>CREATE ACCOUNT</Button> */}
                    <Button
                        onClick={() => {
                            setOpenSignIn(false);
                            navigate("/signup");  // chuyển trang
                        }}
                        block
                        >
                        CREATE ACCOUNT
                    </Button>
                </Flex>
            </Form>
        </Flex>
    );
};

export default SignIn;
