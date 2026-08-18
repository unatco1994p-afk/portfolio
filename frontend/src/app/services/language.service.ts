import { Injectable, signal } from '@angular/core';

export type Language = 'pl' | 'en';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly STORAGE_KEY = 'portfolio_lang';
  readonly currentLang = signal<Language>(this.initLanguage());

  private initLanguage(): Language {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = localStorage.getItem(this.STORAGE_KEY) as Language;
      if (saved === 'pl' || saved === 'en') {
        return saved;
      }
    }
    if (typeof navigator !== 'undefined' && navigator.language) {
      if (navigator.language.toLowerCase().startsWith('pl')) {
        return 'pl';
      }
    }
    return 'en';
  }

  setLanguage(lang: Language): void {
    this.currentLang.set(lang);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(this.STORAGE_KEY, lang);
    }
  }

  toggleLanguage(): void {
    const next = this.currentLang() === 'pl' ? 'en' : 'pl';
    this.setLanguage(next);
  }
}
