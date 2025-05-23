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

export default function RouteComponent() {
    const routeElements = useRoutes([
        {
            path: '/',
            element: (
                <PrimaryLayout>
                    <HomePage />
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
            path: '/compare',
            element: (
                <PrimaryLayout>
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
    ]);
    return routeElements;
}
