import { Component, input } from '@angular/core';
import { RouterModule } from "@angular/router";

@Component({
  selector: 'app-top-bar-layout',
  imports: [RouterModule],
  templateUrl: './top-bar-layout.html',
  styleUrl: './top-bar-layout.scss',
})
export class TopBarLayout {
  pageTitle = input.required<string>();
}
