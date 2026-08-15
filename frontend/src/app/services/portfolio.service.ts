import { Injectable, signal, computed, inject, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PortfolioData } from '../models/portfolio.model';
import { LanguageService, Language } from './language.service';
import { environment } from '../../environments/environment';
import { catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  private readonly http = inject(HttpClient);
  private readonly languageService = inject(LanguageService);

  private readonly dataSignal = signal<PortfolioData | null>(null);
  readonly isLoading = signal<boolean>(true);
  readonly hasError = signal<boolean>(false);
  readonly errorMessage = signal<string>('');

  constructor() {
    effect(() => {
      const lang = this.languageService.currentLang();
      this.fetchDataFromBackend(lang);
    });
  }

  fetchDataFromBackend(lang: Language = this.languageService.currentLang()): void {
    this.isLoading.set(true);
    this.hasError.set(false);
    this.errorMessage.set('');

    this.http.get<PortfolioData>(`${environment.apiUrl}/portfolio?lang=${lang}`)
      .pipe(
        catchError(err => {
          console.error(`Backend API error (${lang}):`, err.message);
          return of(null);
        })
      )
      .subscribe(data => {
        this.isLoading.set(false);
        if (data) {
          this.dataSignal.set(data);
          this.hasError.set(false);
        } else {
          this.dataSignal.set(null);
          this.hasError.set(true);
          this.errorMessage.set(
            lang === 'pl'
              ? 'Brak połączenia z serwerem API portfolio. Upewnij się, że usługa backendowa Quarkus jest uruchomiona.'
              : 'Unable to connect to the portfolio API server. Make sure the Quarkus backend service is running.'
          );
        }
      });
  }

  readonly isLoadedFromBackend = computed(() => !this.isLoading() && !this.hasError() && this.dataSignal() !== null);
  readonly profile = computed(() => this.dataSignal()?.profile ?? null);
  readonly metrics = computed(() => this.dataSignal()?.metrics ?? []);
  readonly projects = computed(() => this.dataSignal()?.projects ?? []);
  readonly skills = computed(() => this.dataSignal()?.skills ?? []);
  readonly experiences = computed(() => this.dataSignal()?.experiences ?? []);
  readonly education = computed(() => this.dataSignal()?.education ?? []);

  readonly selectedProjectCategory = signal<string>('all');

  readonly filteredProjects = computed(() => {
    const category = this.selectedProjectCategory();
    const allProjects = this.projects();
    if (category === 'all') {
      return allProjects;
    }
    return allProjects.filter(p => p.category === category);
  });

  setProjectCategoryFilter(category: string): void {
    this.selectedProjectCategory.set(category);
  }
}
