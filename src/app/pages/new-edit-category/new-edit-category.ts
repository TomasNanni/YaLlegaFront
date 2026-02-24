import { Component, inject, input, OnInit, viewChild } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Category, NewEditCategoryI } from '../../interfaces/category';
import { ProductDetailsI } from '../../interfaces/product';
import { CategoryService } from '../../services/category-service';
import { ProductService } from '../../services/product-service';
import { Spinner } from "../../spinner/spinner/spinner";
import { ProductItem } from "../../components/product-item/product-item";
import { AuthService } from '../../services/auth-service';
import { showConfirmModal, showCompletionModal } from '../../modals/modals';

@Component({
  selector: 'app-new-edit-category',
  imports: [Spinner, ProductItem, FormsModule, RouterLink],
  templateUrl: './new-edit-category.html',
  styleUrl: './new-edit-category.scss',
})
export class NewEditCategory implements OnInit {
  categoryService = inject(CategoryService);
  productService = inject(ProductService);
  router = inject(Router);
  backError = false;
  backRequestInProgress = false;
  idCategory = input<number>();
  restaurantId = input.required<number>();
  category: Category | undefined;
  restaurantProducts: ProductDetailsI[] = [];
  selectedProductIds: number[] = [];
  auth = inject(AuthService);
  form = viewChild<NgForm>("categoryForm");
  isOwner = false;

  async ngOnInit() {
    this.isOwner = await this.auth.validateOwner(this.restaurantId());
    if (!this.isOwner) {
      return;
    }
    else {
      if (this.idCategory()) {
        const res: Category | null = await this.categoryService.getCategoryById(this.idCategory()!);
        if (res) {
          this.category = res;
          this.selectedProductIds = this.category.products.map(p => p.id);
          this.form()?.setValue({
            name: this.category.name,
            description: this.category.description,
            restaurantUserId: this.restaurantId(),
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
    this.backRequestInProgress = true;
    this.backError = false;

    const formCategory: NewEditCategoryI = {
      name: form.value.name,
      description: form.value.description || '',
      RestaurantUserId: parseInt(form.value.restaurantUserId),
      productsId: this.selectedProductIds
    };

    let res;

    if (this.idCategory()) {
      const message = await this.showConfirmModalEdit();
      if (message) {
        res = await this.categoryService.editCategory( formCategory, this.category!.id);
        this.showCompletionModalEdit();
      } else {
        this.backRequestInProgress = false;
        return;
      }
    } else {
      const message = await this.showConfirmModalCreate();
      if (message) {
        res = await this.categoryService.createCategory(formCategory);
        this.showCompletionModalCreate();
      } else {
        this.backRequestInProgress = false;
        return;
      }
    }

    if (!res) {
      this.backRequestInProgress = false;
      this.backError = true;
      return;
    }

    this.backRequestInProgress = false;
    this.router.navigate(["/restaurant", this.restaurantId()]);
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