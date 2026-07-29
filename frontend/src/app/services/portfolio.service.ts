import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PortfolioData } from '../models/portfolio.model';
import { environment } from '../../environments/environment';
import { catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  private readonly http = inject(HttpClient);

  // Default fallback mock data
  private readonly defaultData: PortfolioData = {
    profile: {
      name: 'Partial Derivative',
      title: 'Senior DevOps & Software Engineer',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBuytYhIPcEDORYmsl4HVUxqSrADgbfa_N4e0sQ994gm_6Mv9wqpLme5qsL9Ty4IIJ1OuQ4dG-COoAHucw-L59H65XuYhVPGDDEJORcbCCY4bZ6dgh6m_18Yg_foRTC8m7sh-Ym5dw1o9pyV1ye6RWUEsmZ_G1oJU7XH4zMp4N_Ztn9NvYBbWleymhryuTWDbLUejvgWvxNpPgM9-5iCCBobA3laB9W4Rjyx8C-5l8ic_lV1uUb11syYL32JNGZLdmunxiE0sLrnyQE',
      status: 'AVAILABLE_FOR_CONTRACTS',
      bio: 'Inżynier oprogramowania i Cloud Architect pasjonujący się skalowalnymi mikroserwisami, GraalVM, Kubernetes oraz automatyzacją CI/CD w chmurze GCP.',
      location: 'Warsaw, Poland (Hybrid / Remote)',
      email: 'dev@portfolio.internal',
      githubUrl: 'https://github.com',
      linkedinUrl: 'https://linkedin.com'
    },
    metrics: [
      { id: 'm1', label: 'System Uptime', value: '99.99%', trend: '+0.01%', status: 'optimal' },
      { id: 'm2', label: 'Kubernetes Nodes', value: '3 Active', status: 'optimal' },
      { id: 'm3', label: 'GraalVM Cold Start', value: '18ms', trend: '-82%', status: 'optimal' },
      { id: 'm4', label: 'Build Success Rate', value: '100%', status: 'good' }
    ],
    projects: [
      {
        id: 'p1',
        title: 'GCP Cloud & GKE Microservices Monorepo',
        category: 'cloud',
        description: 'Produkcyjne portfolio zintegrowane w monorepo: Quarkus Native z GraalVM, SPA w Angularze 19, packaging Helm oraz pipeline CI/CD na GCP Cloud Build z Workload Identity.',
        metrics: '< 50MB RAM footprint per pod',
        techStack: ['Quarkus', 'GraalVM', 'Angular 19', 'GCP GKE', 'Helm', 'Cloud Build'],
        githubUrl: 'https://github.com/example/portfolio-gcp',
        featured: true,
        status: 'PRODUCTION'
      },
      {
        id: 'p2',
        title: 'High-Throughput Reactive Event Streamer',
        category: 'backend',
        description: 'System rozproszonego przetwarzania zdarzeń w czasie rzeczywistym z gwarancją dostarczenia Exactly-Once i integracją z Apache Kafka.',
        metrics: '150k msg/sec throughput',
        techStack: ['Java 21', 'Quarkus Reactive', 'Kafka', 'Docker', 'Prometheus'],
        githubUrl: 'https://github.com/example/event-streamer',
        featured: true,
        status: 'ACTIVE'
      },
      {
        id: 'p3',
        title: 'GitOps Kubernetes Fleet Automator',
        category: 'devops',
        description: 'Narzędzie CLI i kontroler Kubernetes do bezobsługowej synchronizacji specyfikacji klastrów z wykorzystaniem ArgoCD i Helm Chartów.',
        metrics: 'Zero-downtime rollouts',
        techStack: ['Go', 'Kubernetes Operator SDK', 'ArgoCD', 'Helm', 'Terraform'],
        githubUrl: 'https://github.com/example/gitops-automator',
        featured: false,
        status: 'STABLE'
      }
    ],
    skills: [
      {
        id: 's1',
        name: 'Quarkus & GraalVM',
        category: 'Backend & JVM',
        proficiency: 95,
        experience: '4+ lat',
        icon: 'terminal',
        highlights: ['Native compilation', 'RESTEasy Reactive', 'Panache ORM', 'Low memory footprint']
      },
      {
        id: 's2',
        name: 'Angular (Signals & Standalone)',
        category: 'Frontend & Web',
        proficiency: 92,
        experience: '5+ lat',
        icon: 'code',
        highlights: ['Signals architecture', 'Control Flow syntax', 'Nginx SPA deployment', 'SCSS design system']
      },
      {
        id: 's3',
        name: 'GCP, GKE & Kubernetes',
        category: 'Cloud & Infrastructure',
        proficiency: 90,
        experience: '4+ lat',
        icon: 'cloud',
        highlights: ['GKE Autopilot', 'Workload Identity', 'Ingress & Managed Certs', 'Helm v3']
      },
      {
        id: 's4',
        name: 'CI/CD & Cloud Build',
        category: 'DevOps & CI/CD',
        proficiency: 88,
        experience: '5+ lat',
        icon: 'rocket_launch',
        highlights: ['GCP Cloud Build triggers', 'Multi-stage Docker builds', 'Helm release management']
      }
    ],
    experiences: [
      {
        id: 'e1',
        company: 'Cloud Native Solutions Inc.',
        role: 'Senior DevOps & Cloud Architect',
        period: '2022 - PRESENT',
        location: 'Warsaw, Poland',
        summary: 'Projektowanie i wdrożenie wielochmurowej architektury mikrousługowej opartej na GKE Autopilot, Quarkusie oraz Helm.',
        achievements: [
          'Zredukowano zużycie pamięci RAM o 70% dzięki kompilacji GraalVM Native Image w kontenerach.',
          'Wdrożono w pełni bezpieczny pipeline CI/CD bez długożyciowych kluczy service account (Workload Identity Federation).',
          'Zapewniono dostępność infrastruktury na poziomie 99.99% Uptime.'
        ],
        technologies: ['GCP', 'GKE', 'Quarkus', 'GraalVM', 'Helm', 'Cloud Build', 'Angular'],
        isCurrent: true
      },
      {
        id: 'e2',
        company: 'Enterprise Software Corp',
        role: 'Full Stack Java / Angular Engineer',
        period: '2019 - 2022',
        location: 'Warsaw, Poland',
        summary: 'Rozwój skalowalnych aplikacji webowych w architekturze mikrousługowej oraz systemów zarządzania flotą serwerów.',
        achievements: [
          'Przeprowadzono migrację aplikacji z monolitu Spring Boot do reaktywnego środowiska Quarkus.',
          'Stworzono kompleksowy system design komponentów Angulara z wysokim wskaźnikiem pokrycia testami.'
        ],
        technologies: ['Java', 'Spring Boot', 'Quarkus', 'Angular', 'Docker', 'Kubernetes'],
        isCurrent: false
      }
    ]
  };

  // State Signal initialized with default data
  private readonly dataSignal = signal<PortfolioData>(this.defaultData);

  // Signal indicating whether backend data is actively loaded
  readonly isLoadedFromBackend = signal<boolean>(false);

  constructor() {
    this.fetchDataFromBackend();
  }

  fetchDataFromBackend(): void {
    this.http.get<PortfolioData>(`${environment.apiUrl}/portfolio`)
      .pipe(
        catchError(err => {
          console.warn('Backend API unavailable, using fallback portfolio data:', err.message);
          return of(null);
        })
      )
      .subscribe(data => {
        if (data) {
          this.dataSignal.set(data);
          this.isLoadedFromBackend.set(true);
        }
      });
  }

  // Read-only Signal Expositions
  readonly profile = computed(() => this.dataSignal().profile);
  readonly metrics = computed(() => this.dataSignal().metrics);
  readonly projects = computed(() => this.dataSignal().projects);
  readonly skills = computed(() => this.dataSignal().skills);
  readonly experiences = computed(() => this.dataSignal().experiences);

  // Selected filter signal for projects view
  readonly selectedProjectCategory = signal<string>('all');

  // Filtered projects computed signal
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
