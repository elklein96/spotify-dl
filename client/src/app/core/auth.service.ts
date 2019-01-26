import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { CookieService } from './cookie.service';
import { EnvironmentService } from './env.service';
import { User } from './models/user.model';

@Injectable()
export class AuthService {

    constructor (private http: HttpClient,
        private cookieService: CookieService) { }

    getAccessToken() {
        return this.cookieService.getCookie(EnvironmentService.AUTH_COOKIE_NAME);
    }

    getUserData(): Observable<User> {
        return <Observable<User>>this.http.get(EnvironmentService.USER_URL, { withCredentials: true });
    }

    getUserCookie() {
        try {
            const rawCookie = decodeURIComponent(this.cookieService.getCookie(EnvironmentService.USER_COOKIE_NAME));
            return JSON.parse(rawCookie);
        } catch (err) {
            console.error('Error reading user data from cookie:', err);
            return;
        }
    }

    logOut(): Observable<any> {
        return this.http.delete(EnvironmentService.LOGIN_URL, { withCredentials: true });
    }
}
