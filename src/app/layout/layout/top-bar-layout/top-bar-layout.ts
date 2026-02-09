import { Component, Input } from '@angular/core';
import { RouterModule, RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-top-bar-layout',
  imports: [RouterOutlet, RouterModule],
  templateUrl: './top-bar-layout.html',
  styleUrl: './top-bar-layout.scss',
})
export class TopBarLayout {
  @Input() title!: string;
}
