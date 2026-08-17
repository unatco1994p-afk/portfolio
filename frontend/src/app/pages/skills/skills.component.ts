import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../services/portfolio.service';
import { LanguageService } from '../../services/language.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

interface CategoryFilter {
  id: string;
  labelKey: string;
  icon: string;
}

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss'
})
export class SkillsComponent {
  readonly portfolioService = inject(PortfolioService);
  readonly languageService = inject(LanguageService);

  readonly selectedCategory = signal<string>('all');

  readonly categories: CategoryFilter[] = [
    { id: 'all', labelKey: 'skills.catAll', icon: 'apps' },
    { id: 'backend', labelKey: 'skills.catBackend', icon: 'terminal' },
    { id: 'frontend', labelKey: 'skills.catFrontend', icon: 'code' },
    { id: 'devops', labelKey: 'skills.catDevops', icon: 'cloud' },
    { id: 'security', labelKey: 'skills.catSecurity', icon: 'verified_user' },
    { id: 'methodology', labelKey: 'skills.catMethodology', icon: 'architecture' }
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
