import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../services/portfolio.service';
import { LanguageService } from '../../services/language.service';

interface CategoryFilter {
  id: string;
  labelPl: string;
  labelEn: string;
  icon: string;
}

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss'
})
export class SkillsComponent {
  readonly portfolioService = inject(PortfolioService);
  readonly languageService = inject(LanguageService);

  readonly currentLang = this.languageService.currentLang;
  readonly selectedCategory = signal<string>('all');

  readonly categories: CategoryFilter[] = [
    { id: 'all', labelPl: 'Wszystkie', labelEn: 'All Stacks', icon: 'apps' },
    { id: 'backend', labelPl: 'Backend & JVM', labelEn: 'Backend & JVM', icon: 'terminal' },
    { id: 'frontend', labelPl: 'Frontend & UI', labelEn: 'Frontend & UI', icon: 'code' },
    { id: 'devops', labelPl: 'DevOps & Cloud', labelEn: 'DevOps & Cloud', icon: 'cloud' },
    { id: 'security', labelPl: 'Security & Jakość', labelEn: 'Security & Quality', icon: 'verified_user' },
    { id: 'methodology', labelPl: 'Metodyki & Architektura', labelEn: 'Methodology & Arch', icon: 'architecture' }
  ];

  readonly filteredSkills = computed(() => {
    const category = this.selectedCategory();
    const allSkills = this.portfolioService.skills();
    if (category === 'all') {
      return allSkills;
    }
    return allSkills.filter(skill => skill.category === category);
  });

  setCategory(categoryId: string): void {
    this.selectedCategory.set(categoryId);
  }

  retry(): void {
    this.portfolioService.fetchDataFromBackend();
  }
}
