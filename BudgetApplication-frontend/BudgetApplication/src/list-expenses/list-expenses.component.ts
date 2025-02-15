import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-expenses',
  standalone: true, 
  imports: [CommonModule],
  templateUrl: './list-expenses.component.html',
  styleUrls: ['./list-expenses.component.css']
})
export class ListExpensesComponent implements OnInit {
  expenses: any[] = [];
  private apiUrl = 'http://localhost:5030/api/expense'; 

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadExpenses();
  }

  loadExpenses(): void {
    const token = localStorage.getItem('token'); 
    if (!token) {
      console.error("No token found. User is not logged in.");
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` 
    });

    this.http.get<any[]>(this.apiUrl, { headers }).subscribe({
      next: (data) => this.expenses = data || [],
      error: (err) => console.error('Error fetching expenses:', err)
    });
  }

  editExpense(id: number): void {
    this.router.navigate([`/expense/${id}`]);
  }

  deleteExpense(id: number): void {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("No token found. User is not logged in.");
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`  
    });

    this.http.delete(`${this.apiUrl}/${id}`, { headers }).subscribe({
      next: () => {
        this.expenses = this.expenses.filter(expense => expense.id !== id);
        console.log('Expense deleted successfully.');
      },
      error: (err) => {
        console.error('Error deleting expense:', err);
      }
    });
  }
}
