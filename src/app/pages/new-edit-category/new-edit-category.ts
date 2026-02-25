import { Component, inject, input, OnInit, signal, viewChild } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Category, NewCategoryI } from '../../interfaces/category';
import { ProductDetailsI } from '../../interfaces/product';
import { CategoryService } from '../../services/category-service';
import { ProductService } from '../../services/product-service';
import { Spinner } from "../../spinner/spinner/spinner";
import { ProductItem } from "../../components/product-item/product-item";
import { AuthService } from '../../services/auth-service';
import { showConfirmModal, showCompletionModal } from '../../modals/modals';
import { TopBarLayout } from "../../layout/layout/top-bar-layout/top-bar-layout";

@Component({
  selector: 'app-new-edit-category',
  imports: [Spinner, ProductItem, FormsModule, TopBarLayout],
  templateUrl: './new-edit-category.html',
  styleUrl: './new-edit-category.scss',
})
export class NewEditCategory implements OnInit {
  categoryService = inject(CategoryService);
  productService = inject(ProductService);
  router = inject(Router);
  backError = false;
  backRequestInProgress = signal<boolean>(false);
  idCategory = input<number>();
  idRestaurant = input.required<number>();
  category: Category | undefined;
  restaurantProducts: ProductDetailsI[] = [];
  selectedProductIds: number[] = [];
  auth = inject(AuthService);
  form = viewChild<NgForm>("categoryForm");
  isOwner = false;

  async ngOnInit() {
    this.isOwner = await this.auth.validateOwner(this.idRestaurant());
    if (this.isOwner == false) {
      this.router.navigate(["/"]);
    }
    else {
      if (this.idCategory() != 0) {
        const res: Category | null = await this.categoryService.getCategoryById(this.idCategory()!);
        if (res) {
          this.category = res;
          this.restaurantProducts = this.category.products;
          this.selectedProductIds = this.category.products.map(p => p.id);
          this.form()?.setValue({
            name: this.category.name,
            description: this.category.description,
            productsId: this.selectedProductIds,
          });
        }
      }
    }
  }

  toggleProductSelection(productId: number) {
    const index = this.selectedProductIds.indexOf(productId);
    if (index > -1) {
      this.selectedProductIds.splice(index, 1);
    } else {
      this.selectedProductIds.push(productId);
    }
  }

  async handleFormSubmission(form: NgForm) {
    this.backRequestInProgress.set(true);
    this.backError = false;

    const formCategory: NewCategoryI = {
      name: form.value.name,
      description: form.value.description || '',
      RestaurantUserId: this.idRestaurant(),
      productsId: this.selectedProductIds,
    };

    let res;

    if (this.idCategory()) {
      const message = await this.showConfirmModalEdit();
      if (message) {
        res = await this.categoryService.editCategory(formCategory, this.idCategory()!);
        this.showCompletionModalEdit;
      } else {
        this.backRequestInProgress.set(false);
        return;
      }
    } else {
      const message = await this.showConfirmModalCreate();
      if (message) {
        res = await this.categoryService.createCategory(formCategory);
        this.showCompletionModalCreate();
      } else {
        this.backRequestInProgress.set(false);
        return;
      }
    }

    if (!res) {
      this.backRequestInProgress.set(false)
      this.backError = true;
      return;
    }

    this.backRequestInProgress.set(false);
    this.router.navigate(["/restaurant", this.idRestaurant()]);
  }

  showConfirmModalEdit() {
    return showConfirmModal.fire({
      confirmButtonText: "Confirmar",
      title: "Confirma editar la categoria?",
    }).then((result) => {
      if (result.isConfirmed) {
        return true;
      };
      return false;
    });
  }
  showCompletionModalEdit() {
    showCompletionModal.fire({
      title: "Categoria editada correctamente",
    });
  }

  showConfirmModalCreate() {
    return showConfirmModal.fire({
      confirmButtonText: "Confirmar",
      title: "Confirma crear la categoria?",
    }).then((result) => {
      if (result.isConfirmed) {
        return true;
      };
      return false;
    });
  }
  showCompletionModalCreate() {
    showCompletionModal.fire({
      title: "Categoria creada correctamente",
    });
  }
}