import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  constructor() {}

  getRequest(val: any, del: number): Observable<any> {
    return of(val).pipe(delay(del));
  }
}
