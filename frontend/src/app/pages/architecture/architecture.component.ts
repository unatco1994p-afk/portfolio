import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../services/portfolio.service';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-architecture',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './architecture.component.html',
  styleUrl: './architecture.component.scss'
})
export class ArchitectureComponent {
  readonly portfolioService = inject(PortfolioService);
  readonly languageService = inject(LanguageService);

  readonly metrics = this.portfolioService.metrics;
  readonly isLoadedFromBackend = this.portfolioService.isLoadedFromBackend;
  readonly currentLang = this.languageService.currentLang;
}
