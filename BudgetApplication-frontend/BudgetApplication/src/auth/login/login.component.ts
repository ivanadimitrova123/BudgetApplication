import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router, private authService: AuthService) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.http.post('http://localhost:5030/api/users/login', this.loginForm.value, { responseType: 'json' })
        .subscribe(
          (response: any) => {
            this.authService.login(response.token, response.user);
            this.router.navigate(['/home']);
          },
          error => {
            console.error('Login error', error);
            this.errorMessage = 'Invalid username or password';
          }
        );
    }
  }
}
