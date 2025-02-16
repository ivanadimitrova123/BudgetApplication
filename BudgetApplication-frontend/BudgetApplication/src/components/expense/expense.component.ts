import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';

interface Category {
  id: number;
  name: string;
  categoryFor: string;
}

@Component({
  selector: 'app-expense',
  standalone: false,  // If standalone, import necessary modules
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
  userId: number = 0;

  months = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService
  ) {
    this.expenseForm = this.fb.group({
      month: ['', Validators.required],
      year: ['', [Validators.required, Validators.min(2000)]],
      amount: ['', [Validators.required, Validators.min(0)]],
      categoryId: ['', Validators.required],
      type: ['Real', Validators.required]
    });
  }

  searchMonth: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 1 ? []
        : this.months.filter(v => v.toLowerCase().includes(term.toLowerCase())).slice(0, 10))
    );

  formatter = (result: string) => result;

  ngOnInit(): void {
    this.fetchCategories();
    this.fetchCurrentDate();
    this.checkIfEdit();
    this.userId = this.authService.getUserId();
  }

  fetchCategories(): void {
    const headers = this.authService.getAuthHeaders();
    if (!headers) {
      this.errorMessage = 'You are not logged in!';
      return;
    }

    this.http.get<Category[]>('http://localhost:5030/api/categories/expense', { headers })
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
    this.yearOptions = Array.from({ length: 11 }, (_, i) => 2025 + i);
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
    const headers = this.authService.getAuthHeaders();
    if (!headers) {
      this.errorMessage = 'You are not logged in!';
      return;
    }

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
      const headers = this.authService.getAuthHeaders();
      if (!headers) {
        this.errorMessage = 'You are not logged in!';
        return;
      }

      const expenseData = {
        ...this.expenseForm.value,
        userId: this.userId
      };

      if (this.expenseId) {
        const updatedExpense = { ...expenseData, id: this.expenseId };
        this.http.put(`http://localhost:5030/api/expense/${this.expenseId}`, updatedExpense, { headers })
          .subscribe({
            next: () => {
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
            next: () => {
              this.successMessage = 'Expense added successfully.';
              this.router.navigate(['/home']);
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
