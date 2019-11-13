import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

const routes = {
  quote: (c: RandomQuoteContext) => `/jokes/random?category=${c.category}`
};

export interface RandomQuoteContext {
  // The quote's category: 'dev', 'explicit'...
  category: string;
}

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  constructor(private httpClient: HttpClient) {}

  getVehicles(): Observable<any> {
    return this.httpClient.get('vehicles').pipe(
      map((body: any) => {
        return body;
      }),
      catchError(() => of('Error, could not load joke :-('))
    );
  }
}
