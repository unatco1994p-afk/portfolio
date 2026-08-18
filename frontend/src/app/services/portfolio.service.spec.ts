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

  it('should be created and issue HTTP GET request to backend API', () => {
    expect(service).toBeTruthy();

    const req = httpMock.expectOne(request => request.url.includes('/portfolio'));
    expect(req.request.method).toBe('GET');

    // Respond with mock data
    req.flush({
      profile: { name: 'Tomasz Zwierzyński', title: 'Senior Software Engineer' },
      metrics: [],
      projects: [],
      skills: [],
      experiences: [],
      education: []
    });

    expect(service.profile()?.name).toBe('Tomasz Zwierzyński');
    expect(service.hasError()).toBeFalse();
  });

  it('should set hasError state when HTTP call fails', () => {
    const req = httpMock.expectOne(request => request.url.includes('/portfolio'));
    req.error(new ProgressEvent('Network error'));

    expect(service.profile()).toBeNull();
    expect(service.hasError()).toBeTrue();
    expect(service.errorMessage()).toBeTruthy();
  });
});
