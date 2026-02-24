export interface ProductDetailsI {
    id: number,
    name: string,
    description: string,
    urlImage: string,
    basePrice: number,
    discount: number,
    isStandout: boolean,
    //hacer happy hour 50%
    happyHourStart: string,
    happyHourEnd: string,
}
export interface NewEditProductI {
    name: string,
    description: string,
    urlImage: string,
    basePrice: number,
    discount: number,
    isStandout: boolean,
    happyHourStart: string,
    happyHourEnd: string,
    idCategory: number,
}