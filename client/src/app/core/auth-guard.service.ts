import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { AuthService } from '../core/auth.service';
import { EnvironmentService } from './env.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private http: HttpClient,
    private router: Router,
    private authService: AuthService) { }

  canActivate(): Observable<boolean> {
    return this.http.get(EnvironmentService.USER_URL, { withCredentials: true })
      .map((data: HttpErrorResponse) => {
        if (data.error) {
          this.router.navigate(['/login']);
        }
        return !!data;
      });
  }
}
