import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-list-incomes',
  standalone: false, 
  templateUrl: './list-incomes.component.html',
  styleUrls: ['./list-incomes.component.css']
})
export class ListIncomesComponent implements OnInit {
  incomes: any[] = [];
  private apiUrl = 'http://localhost:5030/api/income'; 

  constructor(private http: HttpClient, private router: Router,    private authService: AuthService ) {}

  ngOnInit(): void {
    this.loadIncomes();
  }

  loadIncomes(): void {
    const headers = this.authService.getAuthHeaders();  
    if (!headers) {
      console.error("User is not logged in.");
      return;
    }

    this.http.get<any[]>(this.apiUrl, { headers }).subscribe({
      next: (data) => this.incomes = data || [],
      error: (err) => console.error('Error fetching incomes:', err)
    });
  }

  editIncome(id: number): void {
    this.router.navigate([`/income/${id}`]);
  }

  deleteIncome(id: number): void {
    const headers = this.authService.getAuthHeaders();  
    if (!headers) {
      console.error("User is not logged in.");
      return;
    }

    this.http.delete(`${this.apiUrl}/${id}`, { headers }).subscribe({
      next: () => {
        this.incomes = this.incomes.filter(income => income.id !== id);
        console.log('Income deleted successfully.');
      },
      error: (err) => {
        console.error('Error deleting income:', err);
      }
    });
  }
}
