import { Component } from '@angular/core';
import { Category } from "../../components/category/category";
import { TopBarLayout } from "../../layout/layout/top-bar-layout/top-bar-layout";

@Component({
  selector: 'app-register-page',
  imports: [Category, TopBarLayout],
  templateUrl: './register-page.html',
  styleUrl: './register-page.scss',
})
export class RegisterPage {

}
