import { ChangeDetectorRef, Component, inject } from "@angular/core";
import { AuthService } from "../../services/auth-service";
import { Router, RouterModule } from "@angular/router";
import { FormsModule, NgForm } from "@angular/forms";
import { TopBarLayout } from "../../layout/layout/top-bar-layout/top-bar-layout";
import { Spinner } from "../../spinner/spinner/spinner";


@Component({
  selector: 'app-login-page',
  imports: [FormsModule, RouterModule, TopBarLayout, Spinner],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
})
export class LoginPage {
  authService = inject(AuthService)
  router = inject(Router)
  solicitudABackEnCurso = false;
  errorLogin = false;
  private cdr = inject(ChangeDetectorRef);

  async login(form: NgForm) {
    this.errorLogin = false;
    if (!form.value.EmailAddress || !form.value.Password) {
      this.errorLogin = true;
      this.cdr.detectChanges();
      return
    }
    this.solicitudABackEnCurso = true;
    const loginResult = await this.authService.login(form.value);
    this.solicitudABackEnCurso = false;

    if (loginResult) this.router.navigate(["/restaurant/:userId"]);
    this.errorLogin = true;
    this.cdr.detectChanges();
    return;
  }
}
