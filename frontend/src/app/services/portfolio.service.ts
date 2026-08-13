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

  private readonly defaultPlData: PortfolioData = {
    profile: {
      name: 'Tomasz Zwierzyński',
      title: 'Senior Software Engineer',
      avatarUrl: '/images/photo.jpg',
      status: '',
      bio: 'Programista i inżynier oprogramowania z wieloletnim doświadczeniem w tworzeniu systemów samoobsługowych, ewidencji czasu oraz skalowalnych mikroserwisów (Quarkus, Angular, GCP, Kubernetes).',
      location: 'Polska (Zdalnie / Hybrydowo)',
      email: 'tomasz0zwierzynski@gmail.com',
      githubUrl: 'https://github.com/unatco1994p-afk/portfolio',
      linkedinUrl: 'https://www.linkedin.com/in/tomasz-zwierzyński-614733194/'
    },
    metrics: [
      { id: 'm1', label: 'Czas Działania Systemu', value: '99.99%', trend: '+0.01%', status: 'optimal' },
      { id: 'm2', label: 'Węzły Kubernetes', value: '3 Aktywne', status: 'optimal' },
      { id: 'm3', label: 'Zimny Start GraalVM', value: '18ms', trend: '-82%', status: 'optimal' },
      { id: 'm4', label: 'Sukces Pipeline CI/CD', value: '100%', status: 'good' }
    ],
    projects: [
      {
        id: 'p1',
        title: 'GCP Cloud & GKE Microservices Monorepo',
        category: 'cloud',
        description: 'Produkcyjne portfolio zintegrowane w monorepo: Quarkus Native z GraalVM, SPA w Angularze 19, packaging Helm oraz pipeline CI/CD na GCP Cloud Build z Workload Identity.',
        metrics: '< 50MB zużycia RAM na pod',
        techStack: ['Quarkus', 'GraalVM', 'Angular 19', 'GCP GKE', 'Helm', 'Cloud Build'],
        githubUrl: 'https://github.com/tomasz0zwierzynski/portfolio',
        featured: true,
        status: 'PRODUCTION'
      },
      {
        id: 'p2',
        title: 'Wpłatomaty / Wypłatomaty Self-Service GUI',
        category: 'backend',
        description: 'Moduł logiki biznesowej i GUI dla dedykowanych urządzeń samoobsługowych wpłat i wypłat gotówki dla instytucji finansowych.',
        metrics: 'Transakcje w czasie rzeczywistym',
        techStack: ['Java', 'JavaFX', 'Hibernate', 'PostgreSQL', 'REST API'],
        githubUrl: 'https://github.com/tomasz0zwierzynski/',
        featured: true,
        status: 'COMPLETED'
      },
      {
        id: 'p3',
        title: 'System Zarządzania Czasem Pracy',
        category: 'frontend',
        description: 'Nowoczesna aplikacja webowa do rejestracji i analizy ewidencji czasu pracy pracowników w enterprise.',
        metrics: 'Modułowy interfejs webowy',
        techStack: ['Angular', 'TypeScript', 'HTML5', 'CSS3', 'REST API'],
        githubUrl: 'https://github.com/tomasz0zwierzynski/',
        featured: true,
        status: 'STABLE'
      }
    ],
    skills: [
      {
        id: 's1',
        name: 'Backend & JVM',
        category: 'Backend & JVM',
        proficiency: 95,
        experience: '6+ lat',
        icon: 'terminal',
        highlights: ['Java (SE/EE)', 'Quarkus', 'Spring / Spring Boot', 'Hibernate', 'ExpressJS', 'REST API & WebServices', 'GraalVM Native']
      },
      {
        id: 's2',
        name: 'Frontend & Web',
        category: 'Frontend & Web',
        proficiency: 90,
        experience: '5+ lat',
        icon: 'code',
        highlights: ['Angular (Signals & Standalone)', 'TypeScript / JavaScript (ES6+)', 'HTML5 & CSS3/SCSS', 'Vue.js', 'NPM & NodeJS']
      },
      {
        id: 's3',
        name: 'DevOps, Cloud & Narzędzia',
        category: 'DevOps & Cloud',
        proficiency: 88,
        experience: '4+ lat',
        icon: 'cloud',
        highlights: ['Docker & Kubernetes (GKE)', 'Helm Charts', 'Jenkins & GCP Cloud Build', 'Git, Maven & Gradle', 'PostgreSQL, IntelliJ, VS Code']
      },
      {
        id: 's4',
        name: 'Inżynieria & Jakość',
        category: 'Quality & Engineering',
        proficiency: 92,
        experience: '6+ lat',
        icon: 'verified',
        highlights: ['Testowanie manualne i automatyczne', 'Testy jednostkowe i integracyjne (Karma, JUnit)', 'Czytanie i tworzenie dokumentacji technicznej', 'Agile & Praca zespołowa']
      }
    ],
    experiences: [
      {
        id: 'e1',
        company: 'PSI Polska Sp. z o.o.',
        role: 'Software Engineer / Java & Angular Developer',
        period: '12.2020 – Obecnie',
        location: 'Poznań / Polska',
        summary: 'Projektowanie, rozwój oraz utrzymanie zaawansowanych systemów oprogramowania dla przemysłu i logistyki w architekturze mikrousługowej.',
        achievements: [
          'Rozwój skomplikowanych modułów biznesowych w Java/Quarkus i Angular.',
          'Refaktoryzacja i podnoszenie jakości kodu oraz automatyzacja testów jednostkowych i integracyjnych.',
          'Współpraca w zespole programistycznym przy wykorzystaniu zwinnych metodyk Agile.'
        ],
        technologies: ['Java', 'Quarkus', 'Spring Boot', 'Angular', 'TypeScript', 'Docker', 'REST API'],
        isCurrent: true
      },
      {
        id: 'e2',
        company: 'WASKO S.A.',
        role: 'Programista / Full-Stack Engineer',
        period: '08.2018 – 11.2020',
        location: 'Gliwice / Polska',
        summary: 'Tworzenie i rozwój dedykowanych systemów biznesowych, aplikacji bankomatowych/samoobsługowych oraz systemów webowych.',
        achievements: [
          'Projekt Wpłatomaty / Wypłatomaty: Tworzenie interfejsu graficznego GUI i logiki biznesowej dla urządzeń samoobsługowych (Java, JavaFX, Hibernate, PostgreSQL).',
          'Projekt System Zarządzania Czasem Pracy: Tworzenie i rozwój aplikacji klienckiej do ewidencji czasu (Angular, HTML5, CSS3, REST API).',
          'Jakość i Testy: Tworzenie oraz wykonywanie scenariuszy testowych (manualne, integracyjne, jednostkowe).'
        ],
        technologies: ['Java', 'JavaFX', 'Hibernate', 'PostgreSQL', 'Angular', 'HTML5', 'CSS3', 'REST API'],
        isCurrent: false
      }
    ],
    education: [
      {
        id: 'edu1',
        institution: 'Politechnika Śląska w Gliwicach',
        degree: 'mgr inż. (Magister Inżynier)',
        fieldOfStudy: 'Mechatronika',
        specialization: 'Aplikacje Napędowe',
        period: '02.2017 – 10.2018',
        location: 'Gliwice, Polska',
        description: 'Wydział Mechaniczny Technologiczny. Studia II stopnia zakończone uzyskaniem tytułu magistra inżyniera mechatroniki.'
      },
      {
        id: 'edu2',
        institution: 'Politechnika Śląska w Gliwicach',
        degree: 'inż. (Inżynier)',
        fieldOfStudy: 'Mechatronika',
        specialization: '',
        period: '10.2013 – 01.2017',
        location: 'Gliwice, Polska',
        description: 'Wydział Mechaniczny Technologiczny. Studia I stopnia w trybie dziennym zakończone tytułem inżyniera.'
      }
    ]
  };

  private readonly defaultEnData: PortfolioData = {
    profile: {
      name: 'Tomasz Zwierzyński',
      title: 'Senior Software Engineer',
      avatarUrl: '/images/photo.jpg',
      status: '',
      bio: 'Software Engineer with hands-on experience in building self-service systems, time-tracking applications, and scalable microservices (Quarkus, Angular, GCP, Kubernetes).',
      location: 'Poland (Remote / Hybrid)',
      email: 'tomasz0zwierzynski@gmail.com',
      githubUrl: 'https://github.com/unatco1994p-afk/portfolio',
      linkedinUrl: 'https://www.linkedin.com/in/tomasz-zwierzyński-614733194/'
    },
    metrics: [
      { id: 'm1', label: 'System Uptime', value: '99.99%', trend: '+0.01%', status: 'optimal' },
      { id: 'm2', label: 'Kubernetes Nodes', value: '3 Active', status: 'optimal' },
      { id: 'm3', label: 'GraalVM Cold Start', value: '18ms', trend: '-82%', status: 'optimal' },
      { id: 'm4', label: 'CI/CD Build Success Rate', value: '100%', status: 'good' }
    ],
    projects: [
      {
        id: 'p1',
        title: 'GCP Cloud & GKE Microservices Monorepo',
        category: 'cloud',
        description: 'Production portfolio integrated into a monorepo: Quarkus Native with GraalVM, Angular 19 SPA, Helm packaging, and GCP Cloud Build CI/CD with Workload Identity.',
        metrics: '< 50MB RAM footprint per pod',
        techStack: ['Quarkus', 'GraalVM', 'Angular 19', 'GCP GKE', 'Helm', 'Cloud Build'],
        githubUrl: 'https://github.com/tomasz0zwierzynski/portfolio',
        featured: true,
        status: 'PRODUCTION'
      },
      {
        id: 'p2',
        title: 'Self-Service Cash Machine (CDM/ATM) GUI',
        category: 'backend',
        description: 'Business logic and GUI implementation for self-service financial deposit and withdrawal machines.',
        metrics: 'Real-time transaction processing',
        techStack: ['Java', 'JavaFX', 'Hibernate', 'PostgreSQL', 'REST API'],
        githubUrl: 'https://github.com/tomasz0zwierzynski/',
        featured: true,
        status: 'COMPLETED'
      },
      {
        id: 'p3',
        title: 'Work Time Management System',
        category: 'frontend',
        description: 'Modern enterprise web client for managing and tracking employee work hours.',
        metrics: 'Modular web interface',
        techStack: ['Angular', 'TypeScript', 'HTML5', 'CSS3', 'REST API'],
        githubUrl: 'https://github.com/tomasz0zwierzynski/',
        featured: true,
        status: 'STABLE'
      }
    ],
    skills: [
      {
        id: 's1',
        name: 'Backend & JVM',
        category: 'Backend & JVM',
        proficiency: 95,
        experience: '6+ years',
        icon: 'terminal',
        highlights: ['Java (SE/EE)', 'Quarkus', 'Spring / Spring Boot', 'Hibernate', 'ExpressJS', 'REST API & WebServices', 'GraalVM Native']
      },
      {
        id: 's2',
        name: 'Frontend & Web',
        category: 'Frontend & Web',
        proficiency: 90,
        experience: '5+ years',
        icon: 'code',
        highlights: ['Angular (Signals & Standalone)', 'TypeScript / JavaScript (ES6+)', 'HTML5 & CSS3/SCSS', 'Vue.js', 'NPM & NodeJS']
      },
      {
        id: 's3',
        name: 'DevOps, Cloud & Tools',
        category: 'DevOps & Cloud',
        proficiency: 88,
        experience: '4+ years',
        icon: 'cloud',
        highlights: ['Docker & Kubernetes (GKE)', 'Helm Charts', 'Jenkins & GCP Cloud Build', 'Git, Maven & Gradle', 'PostgreSQL, IntelliJ, VS Code']
      },
      {
        id: 's4',
        name: 'Engineering & Quality',
        category: 'Quality & Engineering',
        proficiency: 92,
        experience: '6+ years',
        icon: 'verified',
        highlights: ['Manual & Automated Testing', 'Unit & Integration Testing (Karma, JUnit)', 'Technical Documentation', 'Agile & Teamwork']
      }
    ],
    experiences: [
      {
        id: 'e1',
        company: 'PSI Polska Sp. z o.o.',
        role: 'Software Engineer / Java & Angular Developer',
        period: '12.2020 – Present',
        location: 'Poznan / Poland',
        summary: 'Design, development, and maintenance of enterprise software solutions for industry and logistics in a microservices architecture.',
        achievements: [
          'Development of core business microservice modules in Java/Quarkus and Angular.',
          'Code refactoring, performance tuning, and unit/integration test automation.',
          'Active participation in an Agile development team.'
        ],
        technologies: ['Java', 'Quarkus', 'Spring Boot', 'Angular', 'TypeScript', 'Docker', 'REST API'],
        isCurrent: true
      },
      {
        id: 'e2',
        company: 'WASKO S.A.',
        role: 'Software Developer / Full-Stack Engineer',
        period: '08.2018 – 11.2020',
        location: 'Gliwice / Poland',
        summary: 'Development of custom business applications, self-service bank machine GUI/logic, and web clients.',
        achievements: [
          'Cash Deposit/Withdrawal Machines Project: Developed GUI and business logic for self-service terminals (Java, JavaFX, Hibernate, PostgreSQL).',
          'Work Time Management Project: Developed client web application for work time logging and management (Angular, HTML5, CSS3, REST API).',
          'Quality & Testing: Created and executed test scenarios (manual, integration, unit tests).'
        ],
        technologies: ['Java', 'JavaFX', 'Hibernate', 'PostgreSQL', 'Angular', 'HTML5', 'CSS3', 'REST API'],
        isCurrent: false
      }
    ],
    education: [
      {
        id: 'edu1',
        institution: 'Silesian University of Technology in Gliwice',
        degree: 'M.Sc. Eng. (Master of Science)',
        fieldOfStudy: 'Mechatronics',
        specialization: 'Drive Systems & Applications',
        period: '02.2017 – 10.2018',
        location: 'Gliwice, Poland',
        description: 'Faculty of Mechanical Engineering. Second-cycle Master\'s degree in Mechatronics.'
      },
      {
        id: 'edu2',
        institution: 'Silesian University of Technology in Gliwice',
        degree: 'B.Sc. Eng. (Bachelor of Science)',
        fieldOfStudy: 'Mechatronics',
        specialization: '',
        period: '10.2013 – 01.2017',
        location: 'Gliwice, Poland',
        description: 'Faculty of Mechanical Engineering. Full-time Bachelor\'s degree in Mechatronics.'
      }
    ]
  };

  private readonly dataSignal = signal<PortfolioData>(this.defaultPlData);
  readonly isLoadedFromBackend = signal<boolean>(false);

  constructor() {
    effect(() => {
      const lang = this.languageService.currentLang();
      this.fetchDataFromBackend(lang);
    });
  }

  fetchDataFromBackend(lang: Language = this.languageService.currentLang()): void {
    const fallbackData = lang === 'pl' ? this.defaultPlData : this.defaultEnData;
    this.http.get<PortfolioData>(`${environment.apiUrl}/portfolio?lang=${lang}`)
      .pipe(
        catchError(err => {
          console.warn(`Backend API unavailable, using fallback ${lang.toUpperCase()} portfolio data:`, err.message);
          return of(null);
        })
      )
      .subscribe(data => {
        if (data) {
          this.dataSignal.set(data);
          this.isLoadedFromBackend.set(true);
        } else {
          this.dataSignal.set(fallbackData);
          this.isLoadedFromBackend.set(false);
        }
      });
  }

  readonly profile = computed(() => this.dataSignal().profile);
  readonly metrics = computed(() => this.dataSignal().metrics);
  readonly projects = computed(() => this.dataSignal().projects);
  readonly skills = computed(() => this.dataSignal().skills);
  readonly experiences = computed(() => this.dataSignal().experiences);
  readonly education = computed(() => this.dataSignal().education || []);

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
