import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable, OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

const ClaimTypes = {
  NameIdentifier: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
};
interface Category {
  id: number;
  name: string;
}

@Component({
  selector: 'app-expense',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbTypeaheadModule],
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css']
})
export class ExpenseComponent implements OnInit {
  expenseForm: FormGroup;
  categories: Category[] = [];
  successMessage: string = '';
  errorMessage: string = '';
  expenseId: number | null = null;
  currentExpenseData: any = null;
  currentMonth: string = '';
  currentYear: number = 0;
  yearOptions: number[] = [];
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.expenseForm = this.fb.group({
      month: ['', Validators.required],
      year: ['', [Validators.required, Validators.min(2000)]],
      amount: ['', [Validators.required, Validators.min(0)]],
      categoryId: ['', Validators.required],
      type: ['Real', Validators.required]
    });
  }

  months = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ];

  searchMonth: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 1 ? []
        : this.months.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    );

    formatter = (result: string) => result;


  ngOnInit(): void {
    this.fetchCategories();
    this.fetchCurrentDate();  
    this.checkIfEdit();
  }

  private getUserIdFromToken(token: string): number {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return parseInt(payload[ClaimTypes.NameIdentifier]);
    } catch (e) {
      console.error('Error parsing token:', e);
      return 0;
    }
  }

  fetchCategories(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.errorMessage = 'You must be logged in to fetch categories.';
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.get<Category[]>('http://localhost:5030/api/categories', { headers })
      .subscribe({
        next: (response) => {
          this.categories = response;
        },
        error: (error) => {
          console.error('Error fetching categories:', error);
          this.errorMessage = 'Failed to load categories.';
        }
      });
  }

  fetchCurrentDate(): void {
    this.http.get<any>('http://localhost:5030/api/date/current-date')
      .subscribe({
        next: (response) => {
          this.currentMonth = response.currentMonth;
          this.currentYear = response.currentYear;

          this.expenseForm.patchValue({
            month: this.currentMonth,
            year: this.currentYear
          });

          this.generateYearList(); 
        },
        error: (error) => {
          console.error('Error fetching current date:', error);
        }
      });
  }

  generateYearList(): void {
    this.yearOptions = [];
    for (let year = 2025; year <= 2035; year++) {
      this.yearOptions.push(year);
    }
  }

  checkIfEdit(): void {
    this.activatedRoute.params.subscribe(params => {
      if (params['id']) {
        this.expenseId = +params['id'];
        this.loadExpenseData();
        this.isEditMode = true;
      }
    });
  }

  loadExpenseData(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.errorMessage = 'You must be logged in to load expense data.';
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.get<any>(`http://localhost:5030/api/expense/${this.expenseId}`, { headers })
      .subscribe({
        next: (response) => {
          this.currentExpenseData = response;
          this.expenseForm.patchValue({
            month: response.month,
            year: response.year,
            amount: response.amount,
            categoryId: response.categoryId 
          });

          this.generateYearList(); 
        },
        error: (error) => {
          console.error('Error fetching expense data:', error);
          this.errorMessage = 'Failed to load expense data.';
        }
      });
  }

  onSubmit(): void {
    if (this.expenseForm.valid) {
      const token = localStorage.getItem('token');
      if (!token) {
        this.errorMessage = 'You must be logged in to add or update expenses.';
        return;
      }

      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });

      const userId = this.getUserIdFromToken(token);
      const expenseData = {
        ...this.expenseForm.value,
        userId: userId
      };

      if (this.expenseId) {
        const updatedExpense = {
          ...expenseData,
          id: this.expenseId
        };
        this.http.put(`http://localhost:5030/api/expense/${this.expenseId}`, updatedExpense, { headers })
          .subscribe({
            next: (response) => {
              this.successMessage = 'Expense updated successfully.';
              this.router.navigate(['/list-expense']);
            },
            error: (error) => {
              this.errorMessage = error.error?.message || 'Failed to update expense.';
            }
          });
      } else {
        this.http.post('http://localhost:5030/api/expense', expenseData, { headers })
          .subscribe({
            next: (response) => {
              this.successMessage = 'Expense added successfully.';
              this.router.navigate(['/list-expense']);
            },
            error: (error) => {
              this.errorMessage = error.error?.message || 'Failed to add expense.';
            }
          });
      }
    }
  }

  cancelEdit(): void {
    this.router.navigate(['/list-expense']);
  }
}
