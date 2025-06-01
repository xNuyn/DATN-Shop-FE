import { useRoutes } from 'react-router-dom';
import PrimaryLayout from "../layouts/PrimaryLayout";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";
import HomePage from "../pages/HomePage/HomePage";
import Login from "../pages/Login/Login";
import Signup from "../pages/Signup/Signup";
import TrackOrder from '../pages/TrackOrder/TrackOrder';
import NeedHelp from '../pages/NeedHelp/NeedHelp';
import OrderHistoryPage from '../pages/OrderHistoryPage/OrderHistoryPage';
import AccountSettingPage from '../pages/AccountSetting/AccountSettingPage';
import WishlistPage from '../pages/WishlistPage/WishlistPage';
import Compare from '../pages/Compare/Compare';
import ShoppingCart from '../pages/ShoppingCart/ShoppingCart';
import ShopPage from '../pages/ShopPage/ShopPage';
import ProductDetail from '../pages/ProductDetail/ProductDetail';
import Checkout from '../pages/Checkout/Checkout';
import OrderSuccessPage from '../pages/SuccessPage/OrderSuccessPage';
import OrderDetailPage from '../pages/OrderDetail/OrderDetailPage';

export default function RouteComponent() {
    const routeElements = useRoutes([
        {
            path: '/',
            element: (
                <PrimaryLayout>
                    <HomePage/>
                </PrimaryLayout>
            ),
        },
        {
            path: '/login',
            element: (
                <PrimaryLayout>
                    <Login/>
                </PrimaryLayout>
            ),
        },
        {
            path: '/signup',
            element: (
                <PrimaryLayout>
                    <Signup/>
                </PrimaryLayout>
            ),
        },
        {
            path: '/forgot-password',
            element: (
                <PrimaryLayout>
                    <ForgotPassword/>
                </PrimaryLayout>
            ),
        },
        {
            path: '/track-order',
            element: (
                <PrimaryLayout>
                    <TrackOrder/>
                </PrimaryLayout>
            ),
        },
        {
            path: '/order-detail',
            element: (
                <PrimaryLayout>
                    <OrderDetailPage/>
                </PrimaryLayout>
            ),
        },
        {
            path: '/compare',
            element: (
                <PrimaryLayout>
                    <Compare/>
                </PrimaryLayout>
            ),
        },
        {
            path: '/customer-support',
            element: (
                <PrimaryLayout>
                </PrimaryLayout>
            ),
        },
        {
            path: '/need-help',
            element: (
                <PrimaryLayout>
                    <NeedHelp/>
                </PrimaryLayout>
            ),
        },
        {
            path: '/order-history',
            element: (
                <PrimaryLayout>
                    <OrderHistoryPage/>
                </PrimaryLayout>
            ),
        },
        {
            path: '/account-setting',
            element: (
                <PrimaryLayout>
                    <AccountSettingPage/>
                </PrimaryLayout>
            ),
        },
        {
            path: '/wishlist',
            element: (
                <PrimaryLayout>
                    <WishlistPage/>
                </PrimaryLayout>
            ),
        },
        {
            path: '/shopping-cart',
            element: (
                <PrimaryLayout>
                    <ShoppingCart/>
                </PrimaryLayout>
            ),
        },
        {
            path: '/shop-page',
            element: (
                <PrimaryLayout>
                    <ShopPage/>
                </PrimaryLayout>
            ),
        },
        {
            path: '/product-detail/:id',
            element: (
                <PrimaryLayout>
                    <ProductDetail/>
                </PrimaryLayout>
            ),
        },
        {
            path: '/checkout',
            element: (
                <PrimaryLayout>
                    <Checkout/>
                </PrimaryLayout>
            ),
        },
        {
            path: '/success',
            element: (
                <PrimaryLayout>
                    <OrderSuccessPage/>
                </PrimaryLayout>
            ),
        },
    ]);
    return routeElements;
}
