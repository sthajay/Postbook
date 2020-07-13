import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  isLoading: boolean = false;
  @ViewChild('f', { static: true }) loginForm: NgForm
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  onLogin(form: NgForm): void {
    if(form.invalid){
      return;
    }
    const value = form.value;
    console.log(value.email);
    console.log(value.password);
    this.authService.loginUser(value.email, value.password);
  }

}
