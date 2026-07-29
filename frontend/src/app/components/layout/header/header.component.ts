import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PortfolioService } from '../../../services/portfolio.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  readonly portfolioService = inject(PortfolioService);
  private readonly router = inject(Router);

  readonly profile = this.portfolioService.profile;

  get currentRoutePath(): string {
    return `~/users/dev${this.router.url === '/' ? '/dashboard' : this.router.url}`;
  }
}
