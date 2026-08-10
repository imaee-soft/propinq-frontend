import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ParametersService } from './parameters.service';
import { environment } from '../../environments/environment.development';

describe('ParametersService', () => {
  let service: ParametersService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(ParametersService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should request max-price under /api/v1/parameters', () => {
    service.maxPrice().subscribe((value) => {
      expect(value).toBe(100);
    });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/api/v1/parameters/max-price`,
    );
    expect(req.request.method).toBe('GET');
    req.flush(100);
  });

  it('should request min-price under /api/v1/parameters', () => {
    service.minPrice().subscribe((value) => {
      expect(value).toBe(10);
    });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/api/v1/parameters/min-price`,
    );
    expect(req.request.method).toBe('GET');
    req.flush(10);
  });

  it('should request rooms under /api/v1/parameters', () => {
    service.rooms().subscribe((value) => {
      expect(value).toEqual([1, 2, 3]);
    });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/api/v1/parameters/rooms`,
    );
    expect(req.request.method).toBe('GET');
    req.flush([1, 2, 3]);
  });

  it('should request bathrooms under /api/v1/parameters', () => {
    service.bathrooms().subscribe((value) => {
      expect(value).toEqual([1, 2]);
    });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/api/v1/parameters/bathrooms`,
    );
    expect(req.request.method).toBe('GET');
    req.flush([1, 2]);
  });
});
