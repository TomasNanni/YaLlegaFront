import { CartProductI } from './product';

export interface CartRestaurantGroup {
    restaurantId: number;
    restaurantName: string;
    contact: string;
    products: CartProductI[];
}
