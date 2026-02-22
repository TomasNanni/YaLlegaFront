import { Product } from "./product"


export interface Category {
    id : number,
    name : string,
    description : string,
    products : Product[]
}
export interface NewCategory{
    name: string,
    description: string,
    RestaurantUserId: number,
    productsId : number[];
}
