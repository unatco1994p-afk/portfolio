import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../services/portfolio.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-interests',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './interests.component.html',
  styleUrl: './interests.component.scss'
})
export class InterestsComponent {
  readonly portfolioService = inject(PortfolioService);
  readonly interests = this.portfolioService.interests;

  retry(): void {
    this.portfolioService.fetchDataFromBackend();
  }
}
