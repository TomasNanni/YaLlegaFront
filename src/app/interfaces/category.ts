import { ProductDetailsI } from "./product"


export interface Category {
    id: number,
    name: string,
    description: string,
    products: ProductDetailsI[]
}
export interface NewEditCategoryI {
    name: string,
    description: string,
    RestaurantUserId: number,
    productsId: number[];
}
