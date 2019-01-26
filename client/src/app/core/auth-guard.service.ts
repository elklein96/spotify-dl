import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { EnvironmentService } from './env.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private http: HttpClient,
    private router: Router) { }

  canActivate(): Observable<boolean> {
    return this.http.get(EnvironmentService.USER_URL, { withCredentials: true })
      .pipe(
        map((data: HttpErrorResponse) => {
          if (data.error) {
            this.router.navigate(['/login']);
          }
          return !!data;
        })
      );
  }
}
