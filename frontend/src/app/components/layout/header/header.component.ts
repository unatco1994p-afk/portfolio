import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PortfolioService } from '../../../services/portfolio.service';
import { LanguageService, Language } from '../../../services/language.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  readonly portfolioService = inject(PortfolioService);
  readonly languageService = inject(LanguageService);
  private readonly router = inject(Router);

  readonly profile = this.portfolioService.profile;
  readonly currentLang = this.languageService.currentLang;

  get currentRoutePath(): string {
    return `~/users/tzwierzynski${this.router.url === '/' ? '/skills' : this.router.url}`;
  }

  setLang(lang: Language): void {
    this.languageService.setLanguage(lang);
  }
}
