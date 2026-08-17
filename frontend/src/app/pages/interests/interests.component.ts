import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../services/language.service';

interface InterestItem {
  id: string;
  icon: string;
  titlePl: string;
  titleEn: string;
  categoryPl: string;
  categoryEn: string;
  descPl: string;
  descEn: string;
  tags: string[];
}

@Component({
  selector: 'app-interests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './interests.component.html',
  styleUrl: './interests.component.scss'
})
export class InterestsComponent {
  readonly languageService = inject(LanguageService);
  readonly currentLang = this.languageService.currentLang;

  readonly interests: InterestItem[] = [
    {
      id: 'tech',
      icon: 'memory',
      titlePl: 'Nowe Technologie & Cloud-Native',
      titleEn: 'Emerging Tech & Cloud-Native',
      categoryPl: 'Innowacje & Software',
      categoryEn: 'Innovation & Software',
      descPl: 'Praktyczne eksperymentowanie z kompilacją natywną GraalVM AOT, architekturą mikroserwisową, frameworkiem Quarkus 3.x, reaktywnymi sygnałami w Angularze 19 oraz orkiestracją konteneryzacji na GCP GKE.',
      descEn: 'Hands-on experimentation with GraalVM AOT native image compilation, microservices architecture, Quarkus 3.x, Angular 19 reactive signals, and GCP GKE container orchestration.',
      tags: ['GraalVM AOT', 'Angular 19 Signals', 'Quarkus Native', 'K8s & GCP GKE']
    },
    {
      id: 'mechatronics',
      icon: 'precision_manufacturing',
      titlePl: 'Mechatronika & Automatyka',
      titleEn: 'Mechatronics & Automation',
      categoryPl: 'Inżynieria Hardware',
      categoryEn: 'Hardware Engineering',
      descPl: 'Pielęgnowanie pasji z czasów studiów magisterskich na Wydziale Mechanicznym Technologicznym Politechniki Śląskiej — układy sterowania, automatyka przemysłowa, napędy oraz integracja sprzętu z oprogramowaniem.',
      descEn: 'Fostering academic background from Silesian University of Technology — control systems, industrial automation, power drives, and hardware-software integration.',
      tags: ['mgr inż. Politechnika Śląska', 'Automatyka Przemysłowa', 'Hardware & Embedded']
    },
    {
      id: 'automotive',
      icon: 'directions_car',
      titlePl: 'Motoryzacja & Nowoczesne Pojazdy',
      titleEn: 'Automotive Tech & EV',
      categoryPl: 'Technologia & Transport',
      categoryEn: 'Technology & Mobility',
      descPl: 'Zainteresowanie rozwojem nowoczesnej motoryzacji, zaawansowanymi systemami wspomagania kierowcy (ADAS), technologią pojazdów elektrycznych (EV) oraz inżynierią oprogramowania samochodowego.',
      descEn: 'Keen interest in modern automotive engineering, advanced driver-assistance systems (ADAS), electric vehicle (EV) tech, and embedded car software.',
      tags: ['Systemy ADAS', 'EV Engineering', 'Technologia Samochodowa']
    },
    {
      id: 'outdoor',
      icon: 'hiking',
      titlePl: 'Podróże & Turystyka Górka',
      titleEn: 'Hiking & Mountain Outdoor',
      categoryPl: 'Styl Życia & Outdoor',
      categoryEn: 'Lifestyle & Outdoor',
      descPl: 'Piesze wycieczki w góry, trekking na świeżym powietrzu, odkrywanie nowych szlaków oraz aktywny wypoczynek zapewniający doskonały balans i regenerację po intensywnej pracy architektonicznej.',
      descEn: 'Mountain hiking, outdoor trekking, discovering nature trails, and active outdoor recreation ensuring a healthy work-life balance after intensive coding sessions.',
      tags: ['Trekking Górski', 'Outdoor & Nature', 'Work-Life Balance']
    },
    {
      id: 'gaming',
      icon: 'sports_esports',
      titlePl: 'Gry Strategiczne & E-Sport',
      titleEn: 'Strategy Games & Esports',
      categoryPl: 'Rozrywka Analityczna',
      categoryEn: 'Analytical Gaming',
      descPl: 'Pasja do gier strategicznych i symulacyjnych rozwijających myślenie analityczne, śledzenie e-sportu oraz fascynacja nowinkami z zakresu technologii silników graficznych i renderowania.',
      descEn: 'Passion for strategy & simulation games fostering analytical problem solving, esports tournaments, and following real-time graphics rendering innovations.',
      tags: ['Simulations & Strategy', 'Analytical Thinking', 'Graphics Engines']
    }
  ];
}
