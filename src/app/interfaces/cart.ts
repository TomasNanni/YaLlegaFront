import { CartProductGrouped } from './product';

export interface CartRestaurantGroup {
    restaurantId: number;
    restaurantName: string;
    contact: string;
    products: CartProductGrouped[];
}
