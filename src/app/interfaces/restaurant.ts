export interface NewRestaurant {
    name: string;
    urlLogoImage: string;
    urlBannerImage: string;
    openDays: string[];
    openingTime: string;
    closingTime: string;
    contact: string;
}
export interface NewUser {
  firstName: string;
  lastName: string;
  emailAddress: string;
  password: string;
  secondPassword: string;
}
export interface UserRegistrationRequest {
  user: NewUser;
  restaurant: NewRestaurant;
}
