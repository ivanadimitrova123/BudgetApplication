import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

interface Category {
  id: number;
  name: string;
}

interface Income {
  id: number;
  userId: number;
  month: string;
  year: number;
  categoryId: number;
  amount: number;
  type: string;
}

interface Expense {
  id: number;
  userId: number;
  month: string;
  year: number;
  categoryId: number;
  amount: number;
  type: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  categories: Category[] = [];
  incomes: Income[] = [];
  expenses: Expense[] = [];
  months: { label: string, month: string, year: number }[] = [];
  errorMessage: string = '';
  token: string | null = null;
  userId: number | null = null;

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    this.userId = this.getUserIdFromToken();
    this.fetchAllData();
  }

  getUserIdFromToken(): number | null {
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

  fetchAllData() {
    if (!this.token) {
      this.errorMessage = 'You are not logged in!';
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });

    const categoriesRequest = this.http.get<Category[]>('http://localhost:5030/api/categories', { headers });
    const incomesRequest = this.http.get<Income[]>('http://localhost:5030/api/income', { headers });
    const expensesRequest = this.http.get<Expense[]>('http://localhost:5030/api/expense', { headers });
    const monthsRequest = this.http.get<any[]>('http://localhost:5030/api/date/months-with-data', { headers });

    Promise.all([
      categoriesRequest.toPromise(),
      incomesRequest.toPromise(),
      expensesRequest.toPromise(),
      monthsRequest.toPromise()
    ])
      .then(([categoriesData, incomesData, expensesData, monthsData]) => {
        this.categories = categoriesData || [];
        this.incomes = incomesData || [];
        this.expenses = expensesData || [];
        this.months = (monthsData || []).map(item => ({
          label: `${item.month} ${item.year}`,
          month: item.month,
          year: item.year
        }));
      })
      .catch(err => {
        console.error('Error fetching data:', err);
        this.errorMessage = err.error?.message || 'Failed to load data.';
      });
  }

  getIncomeAmount(categoryId: number, month: string, year: number, type: string): number {
    const filtered = this.incomes.filter(i =>
      i.categoryId === categoryId &&
      i.month === month &&
      i.year === year &&
      i.type.toLowerCase() === type.toLowerCase()
    );
    return filtered.reduce((sum, item) => sum + item.amount, 0);
  }

  getExpenseAmount(categoryId: number, month: string, year: number, type: string): number {
    const filtered = this.expenses.filter(e =>
      e.categoryId === categoryId &&
      e.month === month &&
      e.year === year &&
      e.type.toLowerCase() === type.toLowerCase()
    );
    return filtered.reduce((sum, item) => sum + item.amount, 0);
  }

  getNetAmount(categoryId: number, month: string, year: number): number {
    const totalIncome = this.getIncomeAmount(categoryId, month, year, 'Real');
    const totalExpense = this.getExpenseAmount(categoryId, month, year, 'Real');
    return totalIncome - totalExpense;
  }

  exportPdfDocument() {
    console.log('need to implement');
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
            this.router.navigate(['/register']);
          },
          error: (err) => {
            console.error('Error deactivating account:', err);
            alert('Failed to deactivate account.');
          }
        });
    }
  }
  

    getTotalExpenses(categoryId?: number): number {
      if (categoryId) {
          return this.categories.map(c => this.months.map(m => this.getExpenseAmount(c.id, m.month, m.year, 'Real')))
              .flat().reduce((sum, amount) => sum + amount, 0);
      }
      return this.categories.map(c => this.months.map(m => this.getExpenseAmount(c.id, m.month, m.year, 'Real')))
          .flat().reduce((sum, amount) => sum + amount, 0);
  }
  getTotalIncomes(categoryId?: number): number {
    if (categoryId) {
        return this.categories.map(c => this.months.map(m => this.getIncomeAmount(c.id, m.month, m.year, 'Real')))
            .flat().reduce((sum, amount) => sum + amount, 0);
    }
    return this.categories.map(c => this.months.map(m => this.getIncomeAmount(c.id, m.month, m.year, 'Real')))
        .flat().reduce((sum, amount) => sum + amount, 0);
}

getBalance(): number {
  let total = 0;
  for (const m of this.months) {
      total += this.getBalanceForMonth(m.month, m.year, 'Real');
      total += this.getBalanceForMonth(m.month, m.year, 'Proposal');
  }
  return total;
}

getTotalIncomesForMonth(month: string, year: number, type: string): number {
  return this.incomes
      .filter(i => i.month === month && 
                  i.year === year && 
                  i.type.toLowerCase() === type.toLowerCase())
      .reduce((sum, item) => sum + item.amount, 0);
}

getTotalExpensesForMonth(month: string, year: number, type: string): number {
  return this.expenses
      .filter(e => e.month === month && 
                  e.year === year && 
                  e.type.toLowerCase() === type.toLowerCase())
      .reduce((sum, item) => sum + item.amount, 0);
}

getBalanceForMonth(month: string, year: number, type: string): number {
  const income = this.getTotalIncomesForMonth(month, year, type);
  const expense = this.getTotalExpensesForMonth(month, year, type);
  return income - expense;
}

}
