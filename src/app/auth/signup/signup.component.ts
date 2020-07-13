import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  isLoading: boolean = false;
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  onSignUp(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    const value = form.value;
    this.authService.storeCredentials(value.email, value.password)
      .subscribe(() => {
        this.router.navigate(['/']);
      }, error => {
        this.isLoading = false;
      });
  }

}
