import { Product } from "../components/product/product";

export interface Category {
    id : number,
    name : string,
    description : string,
    products : Product[]
}
