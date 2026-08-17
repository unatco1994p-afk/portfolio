import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'overview', pathMatch: 'full' },
  {
    path: 'overview',
    loadComponent: () => import('./pages/overview/overview.component').then(m => m.OverviewComponent)
  },
  {
    path: 'skills',
    loadComponent: () => import('./pages/skills/skills.component').then(m => m.SkillsComponent)
  },
  {
    path: 'experience',
    loadComponent: () => import('./pages/experience/experience.component').then(m => m.ExperienceComponent)
  },
  {
    path: 'education',
    loadComponent: () => import('./pages/education/education.component').then(m => m.EducationComponent)
  },
  {
    path: 'architecture',
    loadComponent: () => import('./pages/architecture/architecture.component').then(m => m.ArchitectureComponent)
  },
  {
    path: 'interests',
    loadComponent: () => import('./pages/interests/interests.component').then(m => m.InterestsComponent)
  },
  { path: '**', redirectTo: 'overview' }
];
