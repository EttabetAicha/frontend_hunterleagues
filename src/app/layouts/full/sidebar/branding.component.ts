import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-branding',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="branding">
      <a style="text-decoration: none;" [routerLink]="['/']">
      <h1 >Hunter Leagues</h1>
      </a>
    </div>
  `,
})
export class BrandingComponent {
  constructor() {}
}
