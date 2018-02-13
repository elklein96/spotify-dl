import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

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

    getUserData() {
        return this.http.get(EnvironmentService.USER_URL, { withCredentials: true })
            .map((data: User) => {
                return data;
            })
            .catch(this.handleError);
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

    logOut() {
        return this.http.delete(EnvironmentService.LOGIN_URL, { withCredentials: true })
            .map(data => {
                return data;
            })
            .catch(this.handleError);
    }

    private handleError(error: HttpErrorResponse) {
        const msg = `Received a ${error.status} code from ${error.url}`;
        return Observable.throw(msg);
    }
}
