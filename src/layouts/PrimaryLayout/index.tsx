import { FC, Fragment, PropsWithChildren } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "./primary-layout.scss";

const PrimaryLayout: FC<PropsWithChildren> = ({ children }) => {
    return (
        <Fragment>
            <Header />
            <div className="content">{children}</div>
            <Footer />
        </Fragment>
    );
};

export default PrimaryLayout;
