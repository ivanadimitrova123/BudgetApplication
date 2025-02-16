import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent  implements OnInit {
  userId: number | null = null;
  token: string | null = null;

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    this.userId = this.loadUserId();
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }


  loadUserId(): number | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
  
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  deactivateAccount(): void {
    if (!this.userId) {
      alert('User ID is missing. Cannot deactivate account.');
      return;
    }

    if (confirm('Are you sure you want to deactivate your account?')) {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("No token found. Please log in again.");
        return;
      }

      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });

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
