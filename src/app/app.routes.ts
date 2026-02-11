import { Routes } from '@angular/router';
import { LandingPage } from './pages/landing-page/landing-page';
import { LoginPage } from './pages/login-page/login-page';
import { RegisterPage } from './pages/register-page/register-page';
import { RestaurantListPage } from './pages/restaurant-list-page/restaurant-list-page';
import { RestaurantPage } from './pages/restaurant-page/restaurant-page';
import { Category } from './components/category/category';
import { Product } from './components/product/product';
import { ProductDetails } from './components/product-details/product-details';
import { TopBarLayout } from './layout/layout/top-bar-layout/top-bar-layout';

export const routes: Routes = [
    {
        path: "",
        component: LandingPage,
    },
    {
        path: "login",
        component: LoginPage
    },
    {
        path: "register",
        component: RegisterPage
    },
    {
        path: "restaurantList",
        component: RestaurantListPage
    },
    {
        path: "restaurant/:idRestaurant",
        component: RestaurantPage
    },
    {
        path: "productDetails/:idProduct",
        component: ProductDetails
    },
];
