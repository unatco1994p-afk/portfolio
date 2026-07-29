import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectsComponent } from './projects.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ProjectsComponent', () => {
  let component: ProjectsComponent;
  let fixture: ComponentFixture<ProjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectsComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create projects component', () => {
    expect(component).toBeTruthy();
  });

  it('should render filter buttons and filtered project cards', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const filterBtns = compiled.querySelectorAll('.filter-btn');
    expect(filterBtns.length).toBe(4);

    const projectCards = compiled.querySelectorAll('.project-card');
    expect(projectCards.length).toBeGreaterThan(0);
  });

  it('should change filter when clicking a filter button', () => {
    component.setCategory('cloud');
    fixture.detectChanges();
    expect(component.selectedCategory()).toBe('cloud');
  });
});
