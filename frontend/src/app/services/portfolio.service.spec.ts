import { TestBed } from '@angular/core/testing';
import { PortfolioService } from './portfolio.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

describe('PortfolioService', () => {
  let service: PortfolioService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PortfolioService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(PortfolioService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created and issue HTTP GET request to /api/portfolio', () => {
    expect(service).toBeTruthy();

    const req = httpMock.expectOne('/api/portfolio');
    expect(req.request.method).toBe('GET');

    // Respond with mock data
    req.flush({
      profile: { name: 'Backend Loaded Name', title: 'Backend Title' },
      metrics: [],
      projects: [],
      skills: [],
      experiences: []
    });

    expect(service.profile().name).toBe('Backend Loaded Name');
    expect(service.isLoadedFromBackend()).toBeTrue();
  });

  it('should fallback to default data if HTTP call fails', () => {
    const req = httpMock.expectOne('/api/portfolio');
    req.error(new ProgressEvent('Network error'));

    expect(service.profile().name).toBe('Partial Derivative');
    expect(service.isLoadedFromBackend()).toBeFalse();
  });
});
