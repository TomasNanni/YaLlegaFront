import { Routes } from '@angular/router';
import { LoginPage } from './pages/login-page/login-page';
import { RegisterPage } from './pages/register-page/register-page';
import { RestaurantListPage } from './pages/restaurant-list-page/restaurant-list-page';
import { RestaurantPage } from './pages/restaurant-page/restaurant-page';
import { ProductDetails } from './components/product-details/product-details';
import { CartPage } from './pages/cart-page/cart-page';
import { NewEditCategory } from './pages/new-edit-category/new-edit-category';
import { NewEditProduct } from './pages/new-edit-product/new-edit-product';
import { UserPage } from './pages/user-page/user-page';
import { guestGuard } from './guards/guest.guard';
import { authOwnerGuard } from './guards/auth-owner.guard';

export const routes: Routes = [
    {
        path: '',
        component: RestaurantListPage,
        canActivate: [authOwnerGuard]
    },
    {
        path: 'login',
        component: LoginPage,
        canActivate: [authOwnerGuard]
    },
    {
        path: 'register',
        component: RegisterPage,
        canActivate: [authOwnerGuard]
    },
    {
        path: 'restaurant/:idRestaurant',
        component: RestaurantPage,
        canActivate: [authOwnerGuard]
    },
    {
        path: 'productDetails/:idRestaurant/:idProduct',
        component: ProductDetails
    },
    {
        path: 'cart/:idCart',
        component: CartPage
    },
    {
        path: 'category/Edit/:idCategory',
        component: NewEditCategory,
        canActivate: [guestGuard, authOwnerGuard]
    },
    {
        path: 'category/New',
        component: NewEditCategory,
        canActivate: [guestGuard, authOwnerGuard]
    },
    {
        path: 'product/:idRestaurant/New',
        component: NewEditProduct,
        canActivate: [guestGuard, authOwnerGuard]
    },
    {
        path: 'product/:idRestaurant/Edit/:idProduct',
        component: NewEditProduct,
        canActivate: [guestGuard, authOwnerGuard]
    },
    {
        path: 'user/:idRestaurant',
        component: UserPage,
        canActivate: [guestGuard, authOwnerGuard]
    }
];
