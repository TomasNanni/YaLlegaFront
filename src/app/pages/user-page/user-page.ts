import { Component, inject, input, signal, viewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { UserService } from '../../services/user-service';
import { UpdatedUser, User } from '../../interfaces/user';
import { showConfirmModal, showCompletionModal } from '../../modals/modals';
import { Spinner } from '../../spinner/spinner/spinner';
import { TopBarLayout } from '../../layout/layout/top-bar-layout/top-bar-layout';

@Component({
  selector: 'app-user-page',
  imports: [FormsModule, Spinner, TopBarLayout],
  templateUrl: './user-page.html',
  styleUrl: './user-page.scss',
})
export class UserPage {
  idRestaurant = input.required<number>();
  auth = inject(AuthService);
  userService = inject(UserService);
  router = inject(Router);
  form = viewChild<NgForm>("userForm");
  user: User | undefined;
  backError = false;
  backRequestInProgress = signal<boolean>(false);
  isOwner = false;

  async ngOnInit() {
    this.isOwner = await this.auth.validateOwner(this.idRestaurant());
    if (this.isOwner == false) {
      this.router.navigate(["/"]);
    }
    else {
      const res = await this.userService.getUser(this.idRestaurant());
      if (res) {
        this.user = res;
        this.form()?.setValue({
          firstName: this.user.firstName,
          lastName: this.user.lastName,
          emailAddress: this.user.emailAddress,
        });
      }
    }
  }

  goBack() {
    this.router.navigate(['/restaurant', this.idRestaurant()]);
  }

  async handleFormSubmission(form: NgForm) {
    this.backRequestInProgress.set(true);
    this.backError = false;

    const updatedUser: UpdatedUser = {};
    if (form.value.firstName !== this.user!.firstName) {
      updatedUser.firstName = form.value.firstName;
    }
    if (form.value.lastName !== this.user!.lastName) {
      updatedUser.lastName = form.value.lastName;
    }
    if (form.value.emailAddress !== this.user!.emailAddress) {
      updatedUser.emailAddress = form.value.emailAddress;
    }

    if (Object.keys(updatedUser).length === 0) {
      this.backRequestInProgress.set(false);
      return;
    }

    const message = await this.showConfirmModalEdit();
    if (message) {
      const res = await this.userService.updateUser(updatedUser);
      this.showCompletionModalEdit();
      if (!res) {
        this.backRequestInProgress.set(false);
        this.backError = true;
        return;
      }
      this.backRequestInProgress.set(false);
      this.router.navigate(['/restaurant', this.idRestaurant()]);
    } else {
      this.backRequestInProgress.set(false);
    }
  }

  async deleteUser() {
    const message = await this.showConfirmModalDelete();
    if (message) {
      const res = await this.userService.deleteUser();
      if (res) {
        this.showCompletionModalDelete();
        this.auth.logout();
      }
    }
  }

  async logout() {
    const result = await showConfirmModal.fire({
      confirmButtonText: "Confirmar",
      title: "Confirma cerrar sesión?",
    });
    if (result.isConfirmed) {
      this.auth.logout();
    }
  }

  showConfirmModalEdit() {
    return showConfirmModal.fire({
      confirmButtonText: "Confirmar",
      title: "Confirma editar tus datos?",
    }).then((result) => {
      if (result.isConfirmed) {
        return true;
      };
      return false;
    });
  }
  showCompletionModalEdit() {
    showCompletionModal.fire({
      title: "Datos editados correctamente",
    });
  }

  showConfirmModalDelete() {
    return showConfirmModal.fire({
      confirmButtonText: "Confirmar",
      title: "Confirma borrar tu perfil?",
      text: "Esta acción no se puede deshacer",
    }).then((result) => {
      if (result.isConfirmed) {
        return true;
      };
      return false;
    });
  }
  showCompletionModalDelete() {
    showCompletionModal.fire({
      title: "Perfil borrado correctamente",
    });
  }
}
