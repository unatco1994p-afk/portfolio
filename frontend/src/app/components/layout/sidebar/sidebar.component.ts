import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { PortfolioService } from '../../../services/portfolio.service';
import { LanguageService } from '../../../services/language.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  readonly portfolioService = inject(PortfolioService);
  readonly languageService = inject(LanguageService);

  readonly profile = this.portfolioService.profile;
  readonly currentLang = this.languageService.currentLang;
}
