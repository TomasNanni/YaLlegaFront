export interface User {
    id : number;
    firstName: string;
    lastName: string;
    emailAddress: string;
    password: string;
}
export interface NewUser {
  firstName: string;
  lastName: string;
  emailAddress: string;
  password: string;
  secondPassword: string;
}
