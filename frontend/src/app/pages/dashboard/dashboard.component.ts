import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PortfolioService } from '../../services/portfolio.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  readonly portfolioService = inject(PortfolioService);

  readonly profile = this.portfolioService.profile;
  readonly metrics = this.portfolioService.metrics;
  readonly projects = this.portfolioService.projects;
  readonly skills = this.portfolioService.skills;
}
