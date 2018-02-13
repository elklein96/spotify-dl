import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { AuthService } from './auth.service';
import { EnvironmentService } from './env.service';

@Injectable()
export class PlaylistService {

    constructor (private http: HttpClient,
        private authService: AuthService) { }

    getPlaylists(id?: string) {
        const userData = this.authService.getUserCookie();
        const params = new HttpParams().set('user_id', userData.id);
        let url = EnvironmentService.PLAYLIST_URL;
        if (id) {
            url += id;
        }

        return this.http.get(url, { params, withCredentials: true })
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
