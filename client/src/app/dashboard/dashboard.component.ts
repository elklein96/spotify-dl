import { Component } from '@angular/core';
import 'rxjs/add/operator/mergeMap';

import { AuthService } from '../core/auth.service';

import { User } from '../core/models/user.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  user: User;

  constructor(private authService: AuthService) {
    this.user = { display_name: '', email: '', href: '', images: [{}] };
    this.getUserData();
  }

  getAccessToken() {
    return this.authService.getAccessToken();
  }

  getUserData() {
    this.authService.getUserData().subscribe(
      user => {
        this.user = user;
      },
      error => {
        console.error('Error: Could not get user data.', error);
      });
  }
}
