import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss'
})
export class SkillsComponent {
  readonly portfolioService = inject(PortfolioService);
  readonly languageService = inject(LanguageService);

  readonly selectedCategory = signal<string>('all');
  readonly searchQuery = signal<string>('');

  readonly categories: CategoryFilter[] = [
    { id: 'all', labelKey: 'skills.catAll', icon: 'apps' },
    { id: 'backend', labelKey: 'skills.catBackend', icon: 'terminal' },
    { id: 'frontend', labelKey: 'skills.catFrontend', icon: 'code' },
    { id: 'devops', labelKey: 'skills.catDevops', icon: 'cloud' },
    { id: 'security', labelKey: 'skills.catSecurity', icon: 'verified_user' },
    { id: 'methodology', labelKey: 'skills.catMethodology', icon: 'architecture' }
  ];

  readonly isQueryActive = computed(() => this.searchQuery().trim().length >= 2);

  readonly filteredSkills = computed(() => {
    const category = this.selectedCategory();
    const query = this.searchQuery().trim().toLowerCase();
    const allSkills = this.portfolioService.skills();

    return allSkills.filter(skill => {
      const matchesCategory = category === 'all' || skill.category === category;
      if (!matchesCategory) return false;

      // Only search when at least 2 characters are entered
      if (query.length < 2) return true;

      const matchesName = skill.name.toLowerCase().includes(query);
      const matchesHighlights = skill.highlights.some(h => h.toLowerCase().includes(query));

      return matchesName || matchesHighlights;
    });
  });

  setCategory(categoryId: string): void {
    this.selectedCategory.set(categoryId);
  }

  clearSearch(): void {
    this.searchQuery.set('');
  }

  isBadgeMatching(item: string): boolean {
    const q = this.searchQuery().trim().toLowerCase();
    return q.length >= 2 && item.toLowerCase().includes(q);
  }

  retry(): void {
    this.portfolioService.fetchDataFromBackend();
  }
}
