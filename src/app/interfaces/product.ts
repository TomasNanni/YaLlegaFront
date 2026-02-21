export interface Product {
    id: number,
    name : string,
    description: string,
    urlImage: string,
    basePrice: number,
    discount : number,
    isStandout: boolean,
    //hacer happy hour 50%
    happyHourStart : string, 
    happyHourEnd : string,
}
