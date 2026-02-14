import { Component } from '@angular/core';
import { TopBarLayout } from "../../layout/layout/top-bar-layout/top-bar-layout";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-landing-page',
  imports: [TopBarLayout, RouterLink],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.scss',
})
export class LandingPage {

}
