import { Component, inject } from '@angular/core';
import { Category } from "../../components/category/category";
import { TopBarLayout } from "../../layout/layout/top-bar-layout/top-bar-layout";
import { Router, RouterLink } from '@angular/router';
import { RestaurantService } from '../../services/restaurant-service';
import { UserRegistrationRequest } from '../../interfaces/restaurant';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-register-page',
  imports: [Category, TopBarLayout, FormsModule, RouterLink],
  templateUrl: './register-page.html',
  styleUrl: './register-page.scss',
})
export class RegisterPage {
  isLoading = false;
  errorRegister = false;
  solicitudABackEnCurso = false;
  restaurantService = inject(RestaurantService);
  router = inject(Router)
  errorMail = false;
  openDays: string[] = [];

  async register(form: NgForm) {
    this.errorRegister = false;
    if (
      !form.value.firstName ||
      !form.value.lastName ||
      !form.value.emailAddress ||
      !form.value.password ||
      !form.value.secondPassword ||
      form.value.password !== form.value.secondPassword ||
      !form.value.restaurantName ||
      !form.value.urlLogoImage ||
      !form.value.urlBannerImage ||
      !form.value.openingTime ||
      !form.value.closingTime ||
      !form.value.contact || (!form.value.monday && !form.value.tuesday && !form.value.wednesday && !form.value.thursday && !form.value.friday && !form.value.saturday && !form.value.sunday)
    ) {
      this.errorRegister = true;
      return;
    }
    this.solicitudABackEnCurso = true;
    if (form.value.monday) {
      this.openDays.push("monday");
    }
    if (form.value.tuesday) {
      this.openDays.push("tuesday");
    }
    if (form.value.wednesday) {
      this.openDays.push("wednesday");
    }
    if (form.value.thursday) {
      this.openDays.push("thursday");
    }
    if (form.value.friday) {
      this.openDays.push("friday");
    }
    if (form.value.saturday) {
      this.openDays.push("saturday");
    }
    if (form.value.sunday) {
      this.openDays.push("sunday");
    }
    const request: UserRegistrationRequest = {
      user: {
        firstName: form.value.firstName,
        lastName: form.value.lastName,
        emailAddress: form.value.emailAddress,
        password: form.value.password,
        secondPassword: form.value.secondPassword
      },
      restaurant: {
        name: form.value.restaurantName,
        urlLogoImage: form.value.urlLogoImage,
        urlBannerImage: form.value.urlBannerImage,
        openDays: this.openDays,
        openingTime: form.value.openingTime,
        closingTime: form.value.closingTime,
        contact: form.value.contact
      }
    };
    const ok = await this.restaurantService.register(request);
    this.solicitudABackEnCurso = false;

    if (!ok) {
      this.errorRegister = true;
    }
    else {
      this.router.navigate(["/restaurant/:idRestaurant"]);
    }
  }
}
