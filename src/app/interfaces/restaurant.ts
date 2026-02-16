export interface Restaurant {
  id: number;
  name: string;
  urlLogoImage: string;
  urlBannerImage: string;
  openDays: string[];
  openingTime: string;
  closingTime: string;
  contact: string;
}
export type NewRestaurant = Omit<Restaurant, 'id'>