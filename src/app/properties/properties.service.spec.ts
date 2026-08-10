import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { PropertiesService } from './properties.service';
import { environment } from '../../environments/environment.development';

describe('PropertiesService', () => {
  let service: PropertiesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(PropertiesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should list properties under /api/v1/properties', () => {
    service.getProperties().subscribe((value) => {
      expect(value).toEqual([]);
    });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/properties`,
    );
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });
});
