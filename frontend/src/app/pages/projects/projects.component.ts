import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../services/portfolio.service';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent {
  readonly portfolioService = inject(PortfolioService);

  readonly filteredProjects = this.portfolioService.filteredProjects;
  readonly selectedCategory = this.portfolioService.selectedProjectCategory;

  readonly categories = [
    { id: 'all', label: 'All Projects' },
    { id: 'cloud', label: 'Cloud & Infrastructure' },
    { id: 'backend', label: 'Backend & Microservices' },
    { id: 'devops', label: 'DevOps & GitOps' }
  ];

  setCategory(categoryId: string): void {
    this.portfolioService.setProjectCategoryFilter(categoryId);
  }
}
