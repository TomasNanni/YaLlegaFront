import { Routes } from '@angular/router';
import { LandingPage } from './pages/landing-page/landing-page';
import { LoginPage } from './pages/login-page/login-page';
import { RegisterPage } from './pages/register-page/register-page';
import { RestaurantListPage } from './pages/restaurant-list-page/restaurant-list-page';
import { RestaurantPage } from './pages/restaurant-page/restaurant-page';
import { ProductDetails } from './components/product-details/product-details';
import { TopBarLayout } from './layout/layout/top-bar-layout/top-bar-layout';
import { CartPage } from './pages/cart-page/cart-page';
import { NewEditCategory } from './pages/new-edit-category/new-edit-category';
import { NewEditProduct } from './pages/new-edit-product/new-edit-product';
import { guestGuard } from './guards/guest.guard';
import { authOwnerGuard } from './guards/auth-owner.guard';

export const routes: Routes = [
    {
        path: "login",
        component: LoginPage
    },
    {
        path: "register",
        component: RegisterPage
    },
    {
        path: "",
        component: RestaurantListPage
    },
    {
        path: "restaurant/:idRestaurant",
        component: RestaurantPage,
        canActivate: [authOwnerGuard]
    },
    {
        path: "productDetails/:idProduct",
        component: ProductDetails
    },
    {
        path: "cart/:idCart",
        component: CartPage
    },
    {
        path: "category/:idRestaurant/Edit/:idCategory",
        component: NewEditCategory,
        canActivate: [guestGuard]
    },
    {
        path: "category/:idRestaurant/New",
        component: NewEditCategory,
        canActivate: [guestGuard]
    },
    {
        path: "product/:idRestaurant/New",
        component: NewEditProduct,
        canActivate: [guestGuard]
    },
    {
        path: "product/:idRestaurant/Edit/:idProduct",
        component: NewEditProduct,
        canActivate: [guestGuard]
    }
];
