import { Type } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { CoreModule, HttpCacheService } from '@app/core';
import { VehicleService } from './vehicle.service';

describe('VehicleService', () => {
  let vehicleService: VehicleService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreModule, HttpClientTestingModule],
      providers: [HttpCacheService, VehicleService]
    });

    vehicleService = TestBed.get(VehicleService);
    httpMock = TestBed.get(HttpTestingController as Type<HttpTestingController>);

    const htttpCacheService = TestBed.get(HttpCacheService);
    htttpCacheService.cleanCache();
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getVehicles', () => {
    it('should return an array and length morethan zero', () => {
      // Act
      const dataSubscription = vehicleService.getVehicles();

      // Assert
      dataSubscription.subscribe((data: any) => {
        expect(data.length).toBeGreaterThan(0);
      });
      // httpMock.expectOne({}).flush(mockQuote);
    });

    it('should return a string in case of error', () => {
      // Act
      const randomQuoteSubscription = vehicleService.getVehicles();

      // Assert
      randomQuoteSubscription.subscribe((data: any) => {
        expect(typeof data).toEqual('array');
        expect(data).toContain('Error');
      });
      httpMock.expectOne({}).flush(null, {
        status: 500,
        statusText: 'error'
      });
    });
  });
});
