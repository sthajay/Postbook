import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Subscribable, Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated: boolean=false;
  subscription: Subscription;
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.isAuthenticated = this.authService.getIsAuth();
    this.authService.getAuthListener()
      .subscribe(isAuthenticated => {
        this.isAuthenticated = isAuthenticated;
      });
  }


  onLogout(): void{
    this.authService.logoutUser();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
