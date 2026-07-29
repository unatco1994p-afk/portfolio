import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'tech-stack',
    loadComponent: () => import('./pages/tech-stack/tech-stack.component').then(m => m.TechStackComponent)
  },
  {
    path: 'projects',
    loadComponent: () => import('./pages/projects/projects.component').then(m => m.ProjectsComponent)
  },
  {
    path: 'experience',
    loadComponent: () => import('./pages/experience/experience.component').then(m => m.ExperienceComponent)
  },
  { path: '**', redirectTo: 'dashboard' }
];
