import { Injectable, inject } from '@angular/core';
import { LanguageService, Language } from './language.service';
import plDict from '../../assets/i18n/pl.json';
import enDict from '../../assets/i18n/en.json';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private readonly languageService = inject(LanguageService);

  private readonly dictionaries: Record<Language, any> = {
    pl: plDict,
    en: enDict
  };

  translate(key: string): string {
    const lang = this.languageService.currentLang();
    const dict = this.dictionaries[lang] || this.dictionaries.pl;

    const parts = key.split('.');
    let current = dict;
    for (const part of parts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part];
      } else {
        return key;
      }
    }

    return typeof current === 'string' ? current : key;
  }
}
