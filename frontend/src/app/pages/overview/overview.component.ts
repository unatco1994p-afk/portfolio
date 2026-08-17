import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PortfolioService } from '../../services/portfolio.service';
import { LanguageService } from '../../services/language.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatePipe],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent {
  readonly portfolioService = inject(PortfolioService);
  readonly languageService = inject(LanguageService);

  readonly currentLang = this.languageService.currentLang;
  readonly profile = this.portfolioService.profile;
  readonly metrics = this.portfolioService.metrics;
  readonly skills = this.portfolioService.skills;
  readonly experiences = this.portfolioService.experiences;
  readonly education = this.portfolioService.education;
  readonly certifications = this.portfolioService.certifications;

  get currentExperience() {
    return this.experiences().find(exp => exp.isCurrent) ?? this.experiences()[0] ?? null;
  }
}
