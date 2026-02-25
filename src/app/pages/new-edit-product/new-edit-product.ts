import { Component, inject, input, signal, Signal, viewChild } from '@angular/core';
import { FormsModule, NgForm } from "@angular/forms";
import { Spinner } from "../../spinner/spinner/spinner";
import { CategoryService } from '../../services/category-service';
import { AuthService } from '../../services/auth-service';
import { CategoryItem } from "../../components/category-item/category-item";
import { Category } from '../../interfaces/category';
import { NewEditProductI, ProductDetailsI } from '../../interfaces/product';
import { ProductService } from '../../services/product-service';
import { showConfirmModal, showCompletionModal } from '../../modals/modals';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-new-edit-product',
  imports: [FormsModule, Spinner, CategoryItem, RouterLink],
  templateUrl: './new-edit-product.html',
  styleUrl: './new-edit-product.scss',
})
export class NewEditProduct {

  categoryService = inject(CategoryService);
  product: ProductDetailsI | undefined;
  idRestaurant = input.required<number>();
  idProduct = input<number>();
  backError: boolean = false;
  form = viewChild<NgForm>("productForm");
  backRequestInProgress = signal<boolean>(false);
  auth = inject(AuthService);
  productService = inject(ProductService);
  isOwner = false;
  router = inject(Router);
  selectedCategoryIds: number[] = [];
  newCategory: Category = {
    id: 1,
    name: "Nueva categoria",
    description: "Crear una categoria nueva",
    products: [],
  };


  async ngOnInit() {
    this.isOwner = await this.auth.validateOwner(this.idRestaurant());
    if (this.isOwner == false) {
      this.router.navigate(["/"]);
    }
    else {
      if (this.idProduct()) {
        const res: ProductDetailsI | null = await this.productService.getProductById(this.idProduct()!);
        if (res) {
          this.product = res;
          this.form()?.setValue({
            name: this.product.name,
            description: this.product.description,
            urlImage: this.product.urlImage,
            basePrice: this.product.basePrice,
            isStandout: this.product.isStandout,
            discount: this.product.discount,
            happyHourStart: this.product.happyHourStart,
            happyHourEnd: this.product.happyHourEnd,
          });
        }
      }
    }
  }

  toggleCategorySelection(categoryId: number) {
    const index = this.selectedCategoryIds.indexOf(categoryId);
    if (index > -1) {
      this.selectedCategoryIds.splice(index, 1);
    } else {
      this.selectedCategoryIds.push(categoryId);
    }
  }

  checkURL(url: string): boolean {
    return /\.(jpeg|jpg|gif|png)$/i.test(url);
  }

  async handleFormSubmission(form: NgForm) {
    this.backRequestInProgress.set(true);
    this.backError = false;

    const formProduct: NewEditProductI = {
      name: form.value.name,
      description: form.value.description || '',
      urlImage: form.value.urlImage,
      basePrice: parseInt(form.value.basePrice),
      discount: 0,
      isStandout: form.value.isStandout || false,
      happyHourStart: form.value.happyHourStart || '',
      happyHourEnd: form.value.happyHourEnd || '',
      categoriesId: this.selectedCategoryIds,
    };

    let res;

    if (this.idProduct()) {
      const message = await this.showConfirmModalEdit();
      if (message) {
        res = await this.productService.editProduct(
          formProduct,
          this.product!.id
        );
        this.showCompletionModalEdit();
      } else {
        this.backRequestInProgress.set(false);
        return;
      }
    } else {
      const message = await this.showConfirmModalCreate();
      if (message) {
        res = await this.productService.createProduct(formProduct);
        this.showCompletionModalCreate();
      } else {
        this.backRequestInProgress.set(false);
        return;
      }
    }

    if (!res) {
      this.backRequestInProgress.set(false);
      this.backError = true;
      return;
    }

    this.backRequestInProgress.set(false);
    this.router.navigate(["/restaurant", this.idRestaurant()]);
  }

  showConfirmModalEdit() {
    return showConfirmModal.fire({
      confirmButtonText: "Confirmar",
      title: "Confirma editar el producto?",
    }).then((result) => {
      if (result.isConfirmed) {
        return true;
      };
      return false;
    });
  }
  showCompletionModalEdit() {
    showCompletionModal.fire({
      title: "Producto editado correctamente",
    });
  }

  showConfirmModalCreate() {
    return showConfirmModal.fire({
      confirmButtonText: "Confirmar",
      title: "Confirma crear el producto?",
    }).then((result) => {
      if (result.isConfirmed) {
        return true;
      };
      return false;
    });
  }
  showCompletionModalCreate() {
    showCompletionModal.fire({
      title: "Producto creado correctamente",
    });
  }
}
