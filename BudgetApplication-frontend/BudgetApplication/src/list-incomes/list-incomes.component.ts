import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-incomes',
  standalone: true, 
  imports: [CommonModule],
  templateUrl: './list-incomes.component.html',
  styleUrls: ['./list-incomes.component.css']
})
export class ListIncomesComponent implements OnInit {
  incomes: any[] = [];
  private apiUrl = 'http://localhost:5030/api/income'; 

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadIncomes();
  }

  loadIncomes(): void {
    const token = localStorage.getItem('token'); 
    if (!token) {
      console.error("No token found. User is not logged in.");
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` 
    });

    this.http.get<any[]>(this.apiUrl, { headers }).subscribe({
      next: (data) => this.incomes = data || [],
      error: (err) => console.error('Error fetching incomes:', err)
    });
  }

  editIncome(id: number): void {
    this.router.navigate([`/income/${id}`]);
  }

  deleteIncome(id: number): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

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
