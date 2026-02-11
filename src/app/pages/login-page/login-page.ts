import { Component, inject } from "@angular/core";
import { AuthService } from "../../services/auth-service";
import { Router, RouterModule } from "@angular/router";
import { FormsModule, NgForm } from "@angular/forms";
import { TopBarLayout } from "../../layout/layout/top-bar-layout/top-bar-layout";


@Component({
  selector: 'app-login-page',
  imports: [FormsModule, RouterModule, TopBarLayout],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
})
export class LoginPage {
  authService = inject(AuthService)
  router = inject(Router)
  solicitudABackEnCurso = false;
  errorLogin = false;

  async login(form: NgForm) {
    this.errorLogin = false;
    if (!form.value.email || !form.value.password) {
      this.errorLogin = true;
      return
    }
    this.solicitudABackEnCurso = true;

    const loginResult = await this.authService.login(form.value);
    this.solicitudABackEnCurso = false;

    if (loginResult) this.router.navigate(["/restaurant/:userId"]);
    this.errorLogin = true;
  }
}
