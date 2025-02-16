import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  userId: number | null = null;
  token: string | null = null;
  isLoggedIn: boolean = false;

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.token$.subscribe(token => {
      this.token = token;
      this.isLoggedIn = !!token;
      if (this.isLoggedIn) {
        this.userId = this.authService.getUser()?.id;
      } else {
        this.userId = null;
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  deactivateAccount(): void {
    if (!this.userId) {
      alert('User ID is missing. Cannot deactivate account.');
      return;
    }

    if (confirm('Are you sure you want to deactivate your account?')) {
      const headers = this.authService.getAuthHeaders();
      if (!headers) {
        alert("No token found. Please log in again.");
        return;
      }

      this.http.put(`http://localhost:5030/api/users/deactivate/${this.userId}`, {}, { headers })
        .subscribe({
          next: () => {
            alert('Account deactivated successfully.');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            this.router.navigate(['/register']);
          },
          error: (err) => {
            console.error('Error deactivating account:', err);
            alert('Failed to deactivate account.');
          }
        });
    }
  }
}
