import { ProductDetailsI } from "./product"


export interface Category {
    id: number,
    name: string,
    description: string,
    products: ProductDetailsI[]
}
export interface NewCategoryI {
    name: string,
    description: string,
    RestaurantUserId: number,
    productsId: number[];
}
export interface EditCategoryI{
    name: string,
    description: string,
    productsId: number[];
}
