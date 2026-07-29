import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TechStackComponent } from './tech-stack.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('TechStackComponent', () => {
  let component: TechStackComponent;
  let fixture: ComponentFixture<TechStackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechStackComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TechStackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create tech stack component', () => {
    expect(component).toBeTruthy();
  });

  it('should render skill cards', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const cards = compiled.querySelectorAll('.skill-card');
    expect(cards.length).toBeGreaterThan(0);
  });
});
