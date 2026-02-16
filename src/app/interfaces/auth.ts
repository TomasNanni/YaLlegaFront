import { NewRestaurant } from "./restaurant";
import { NewUser } from "./user";

export interface LoginData{
  EmailAddress: string,
  Password: string
}
export interface UserRegistrationRequest {
  user: NewUser;
  restaurant: NewRestaurant;
}

