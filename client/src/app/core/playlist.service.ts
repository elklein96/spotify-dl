import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service';
import { EnvironmentService } from './env.service';

@Injectable()
export class PlaylistService {

    constructor (private http: HttpClient,
        private authService: AuthService) { }

    getPlaylists(id?: string): Observable<any> {
        const userData = this.authService.getUserCookie();
        const params = new HttpParams().set('user_id', userData.id);
        let url = EnvironmentService.PLAYLIST_URL;
        if (id) {
            url += id;
        }
        return <Observable<any>>this.http.get(url, { params, withCredentials: true });
    }
}
