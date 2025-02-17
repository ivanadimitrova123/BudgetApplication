import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { FormsModule } from '@angular/forms';  

interface Category {
  id: number;
  name: string;
  categoryFor: string;  
}


interface Income {
  id: number;
  userId: number;
  month: string;
  year: number;
  categoryId: number;
  category: Category; 
  amount: number;
  type: string;
}

interface Expense {
  id: number;
  userId: number;
  month: string;
  year: number;
  categoryId: number;
  category: Category; 
  amount: number;
  type: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  expenseCategories: Category[] = [];
  incomeCategories: Category[] = [];
  incomes: Income[] = [];
  expenses: Expense[] = [];
  months: { label: string, month: string, year: number }[] = [];
  errorMessage: string = '';
  token: string | null = null;
  userId: number | null = null;
  username: string = '';
  month: string = '';

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    this.userId = this.getUserIdFromToken();
    this.fetchAllData();
  }

  sendMonthlyReport() {
    if (!this.username || !this.month) {
      alert('Please enter both username and month.');
      return;
    }

    const requestData = {
      username: this.username,
      month: this.month
    };
    const url = `http://localhost:5030/api/users/send-monthly-report/${this.username}/${this.month}`;

    this.http.post(url, {}).subscribe(
      response => {
        alert('Monthly report sent successfully.');
      },
      error => {
        alert('Failed to send monthly report.');
      }
    );
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

    const expenseCategoriesRequest = this.http.get<Category[]>('http://localhost:5030/api/categories/expense', { headers });
    const incomeCategoriesRequest = this.http.get<Category[]>('http://localhost:5030/api/categories/income', { headers });    
    const incomesRequest = this.http.get<Income[]>('http://localhost:5030/api/income', { headers });
    const expensesRequest = this.http.get<Expense[]>('http://localhost:5030/api/expense', { headers });
    const monthsRequest = this.http.get<any[]>('http://localhost:5030/api/date/months-with-data', { headers });


    Promise.all([
      expenseCategoriesRequest.toPromise(),
      incomeCategoriesRequest.toPromise(),
      incomesRequest.toPromise(),
      expensesRequest.toPromise(),
      monthsRequest.toPromise()
    ])
      .then(([expenseCategoriesData, incomeCategoriesData, incomesData, expensesData, monthsData]) => {
        this.expenseCategories = expenseCategoriesData || [];
        this.incomeCategories = incomeCategoriesData || [];
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

  
  /*exportPdfDocument() {
    const doc = new jsPDF();
    
    const tableHeaders = [
      ['Category', ...this.months.map(m => m.label)]
    ];
  
    // Create the table body with expenses and incomes
    const tableBody = [
      ...this.expenseCategories.map(category => {
        return [
          `${category.name} (Expense)`,
          ...this.months.map(m => this.getExpenseAmount(category.id, m.month, m.year, 'Real').toFixed(2)),
          ...this.months.map(m => this.getExpenseAmount(category.id, m.month, m.year, 'Proposal').toFixed(2))
        ];
      }),
  
      // Total Expenses (Bold)
      [
        `Total Expenses: ${this.getTotalExpenses()}`,
        ...this.months.map(m => this.getTotalExpensesForMonth(m.month, m.year, 'Real').toFixed(2)),
        ...this.months.map(m => this.getTotalExpensesForMonth(m.month, m.year, 'Proposal').toFixed(2))
      ].map((cell, index) => index === 0 ? { content: cell, styles: { fontStyle: 'bold' } } : cell), 
  
      ...this.incomeCategories.map(category => {
        return [
          `${category.name} (Income)`,
          ...this.months.map(m => this.getIncomeAmount(category.id, m.month, m.year, 'Real').toFixed(2)),
          ...this.months.map(m => this.getIncomeAmount(category.id, m.month, m.year, 'Proposal').toFixed(2))
        ];
      }),
  
      // Total Incomes (Bold)
      [
        `Total Incomes: ${this.getTotalIncomes()}`,
        ...this.months.map(m => this.getTotalIncomesForMonth(m.month, m.year, 'Real').toFixed(2)),
        ...this.months.map(m => this.getTotalIncomesForMonth(m.month, m.year, 'Proposal').toFixed(2))
      ].map((cell, index) => index === 0 ? { content: cell, styles: { fontStyle: 'bold' } } : cell),
  
      // Balance (Bold)
      [
        `Balance: ${this.getBalance()}`,
        ...this.months.map(m => this.getBalanceForMonth(m.month, m.year, 'Real').toFixed(2)),
        ...this.months.map(m => this.getBalanceForMonth(m.month, m.year, 'Proposal').toFixed(2))
      ].map((cell, index) => index === 0 ? { content: cell, styles: { fontStyle: 'bold' } } : cell)
    ];
  
    (doc as any).autoTable({
      head: tableHeaders,
      body: tableBody,
      startY: 30,
      theme: 'striped',
      headStyles: { fontSize: 12, fontStyle: 'bold' },
      bodyStyles: { fontSize: 10 },
      margin: { top: 30, left: 10, right: 10, bottom: 10 },
    });
  
    doc.save('budget-dashboard.pdf');
  }*/
    exportPdfDocument() {
      const doc = new jsPDF('l'); // Landscape mode for better fit
      const title = 'Budget Dashboard';
    
      // Add Title
      doc.setFontSize(16);
      const titleWidth = doc.getTextWidth(title);
      doc.text(title, (doc.internal.pageSize.width - titleWidth) / 2, 20);
    
      // Create table headers
      const headers = [
        [
          { 
            content: 'Category',
            styles: { halign: 'left', fillColor: [253, 160, 133] }
          },
          ...this.months.map(m => ({
            content: m.label,
            colSpan: 2,
            styles: { halign: 'center', fillColor: [253, 160, 133] }
          }))
        ],
        [
          { content: '', styles: { fillColor: [253, 160, 133] } }, // Empty first cell
          ...this.months.flatMap(m => [
            { content: 'Real', styles: { fillColor: [253, 160, 133] } },
            { content: 'Proposal', styles: { fillColor: [253, 160, 133] } }
          ])
        ]
      ];
    
      // Create table body
      const body = [
        // Expense Categories
        ...this.expenseCategories.map(category => [
          { 
            content: `${category.name} (Expense)`,
            styles: { halign: 'left' }
          },
          ...this.months.flatMap(m => [
            this.getExpenseAmount(category.id, m.month, m.year, 'Real').toFixed(2),
            this.getExpenseAmount(category.id, m.month, m.year, 'Proposal').toFixed(2)
          ])
        ]),
    
        // Total Expenses
        [
          { 
            content: `Total Expenses: ${this.getTotalExpenses().toFixed(2)}`,
            styles: { fontStyle: 'bold', halign: 'left' }
          },
          ...this.months.flatMap(m => [
            { 
              content: this.getTotalExpensesForMonth(m.month, m.year, 'Real').toFixed(2),
              styles: { fontStyle: 'bold' }
            },
            { 
              content: this.getTotalExpensesForMonth(m.month, m.year, 'Proposal').toFixed(2),
              styles: { fontStyle: 'bold' }
            }
          ])
        ],
    
        // Income Categories
        ...this.incomeCategories.map(category => [
          { 
            content: `${category.name} (Income)`,
            styles: { halign: 'left' }
          },
          ...this.months.flatMap(m => [
            this.getIncomeAmount(category.id, m.month, m.year, 'Real').toFixed(2),
            this.getIncomeAmount(category.id, m.month, m.year, 'Proposal').toFixed(2)
          ])
        ]),
    
        // Total Incomes
        [
          { 
            content: `Total Incomes: ${this.getTotalIncomes().toFixed(2)}`,
            styles: { fontStyle: 'bold', halign: 'left' }
          },
          ...this.months.flatMap(m => [
            { 
              content: this.getTotalIncomesForMonth(m.month, m.year, 'Real').toFixed(2),
              styles: { fontStyle: 'bold' }
            },
            { 
              content: this.getTotalIncomesForMonth(m.month, m.year, 'Proposal').toFixed(2),
              styles: { fontStyle: 'bold' }
            }
          ])
        ],
    
        // Balance
        [
          { 
            content: `Balance: ${this.getBalance().toFixed(2)}`,
            styles: { fontStyle: 'bold', halign: 'left' }
          },
          ...this.months.flatMap(m => [
            { 
              content: this.getBalanceForMonth(m.month, m.year, 'Real').toFixed(2),
              styles: { fontStyle: 'bold' }
            },
            { 
              content: this.getBalanceForMonth(m.month, m.year, 'Proposal').toFixed(2),
              styles: { fontStyle: 'bold' }
            }
          ])
        ]
      ];
    
      // Generate PDF table
      (doc as any).autoTable({
        head: headers,
        body: body,
        startY: 30,
        theme: 'striped',
        headStyles: { 
          fontSize: 12,
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        },
        bodyStyles: {
          fontSize: 10,
          textColor: [0, 0, 0]
        },
        margin: { top: 30 },
        styles: {
          cellPadding: 3,
          overflow: 'linebreak',
          valign: 'middle'
        },
        columnStyles: {
          0: { cellWidth: 'auto', halign: 'left' },
          ...Array.from({ length: this.months.length * 2 + 1 }, (_, i) => i).reduce((acc: any, _, index) => {
            if (index > 0) {
              acc[index] = { halign: 'center' };
            }
            return acc;
          }, {})
        }
      });
    
      doc.save('budget-dashboard.pdf');
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
          return this.expenseCategories.map(c => this.months.map(m => this.getExpenseAmount(c.id, m.month, m.year, 'Real')))
              .flat().reduce((sum, amount) => sum + amount, 0);
      }
      return this.expenseCategories.map(c => this.months.map(m => this.getExpenseAmount(c.id, m.month, m.year, 'Real')))
          .flat().reduce((sum, amount) => sum + amount, 0);
  }
  getTotalIncomes(categoryId?: number): number {
    if (categoryId) {
        return this.incomeCategories.map(c => this.months.map(m => this.getIncomeAmount(c.id, m.month, m.year, 'Real')))
            .flat().reduce((sum, amount) => sum + amount, 0);
    }
    return this.incomeCategories.map(c => this.months.map(m => this.getIncomeAmount(c.id, m.month, m.year, 'Real')))
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
                  i.type.toLowerCase() === type.toLowerCase() &&
                  i.category.hasOwnProperty('categoryFor') &&
                  i.category.categoryFor.toLowerCase() === 'income' 
                )
      .reduce((sum, item) => sum + item.amount, 0);
}

getTotalExpensesForMonth(month: string, year: number, type: string): number {
  return this.expenses
      .filter(e => e.month === month && 
                  e.year === year && 
                  e.type.toLowerCase() === type.toLowerCase() &&
                  e.category.hasOwnProperty('categoryFor') &&
                  e.category.categoryFor.toLowerCase() === 'expense'
                )
      .reduce((sum, item) => sum + item.amount, 0);
}

getBalanceForMonth(month: string, year: number, type: string): number {
  const income = this.getTotalIncomesForMonth(month, year, type);
  const expense = this.getTotalExpensesForMonth(month, year, type);
  return income - expense;
}

}
