import { Flex, Input, Typography } from "antd";
import { FC, memo } from "react";
import Amazon from "../../assets/icons/Amazon";
import Google from "../../assets/icons/Google";
import Philips from "../../assets/icons/Philips";
import Samsung from "../../assets/icons/Samsung";
import Toshiba from "../../assets/icons/Toshiba";
import "./footer.scss";

const Footer: FC = memo(() => {
    return (
        <footer className="footer">
            <div className="footer--wrapper">
                <Typography.Title className="title">
                    Subscribe to our newsletter
                </Typography.Title>
                <Typography.Paragraph className="description">
                    Praesent fringilla erat a lacinia egestas. Donec vehicula
                    tempor libero et cursus. Donec non quam urna. Quisque vitae
                    porta ipsum.
                </Typography.Paragraph>
                <Input.Search
                    placeholder="Email address"
                    allowClear
                    enterButton="SUBSCRIBE"
                    size="large"
                    className="input--search"
                />
                <Flex align="center" justify="center" gap={20}>
                    <Google />
                    <Amazon />
                    <Philips />
                    <Toshiba />
                    <Samsung />
                </Flex>
            </div>
        </footer>
    );
});

export default Footer;
