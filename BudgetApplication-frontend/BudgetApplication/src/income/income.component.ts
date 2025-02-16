import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
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
  selector: 'app-income',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NgbTypeaheadModule],
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.css']
})
export class IncomeComponent implements OnInit {
  incomeForm: FormGroup;
  categories: Category[] = [];
  successMessage: string = '';
  errorMessage: string = '';
  currentYear: number = 0;
  currentMonth: number = 0;
  yearOptions: number[] = [];
  currentIncomeData: any = null;
  incomeId: number | null = null;
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.incomeForm = this.fb.group({
      year: ['', [Validators.required, Validators.min(2000)]],
      month: ['', Validators.required],
      categoryId: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0)]],
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

  checkIfEdit(): void {
    this.activatedRoute.params.subscribe(params => {
      if (params['id']) {
        this.incomeId = +params['id'];
        this.loadIncomeData();
        this.isEditMode = true;
      }
    });
  }

  loadIncomeData(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.errorMessage = 'You must be logged in to load income data.';
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.get<any>(`http://localhost:5030/api/income/${this.incomeId}`, { headers })
      .subscribe({
        next: (response) => {
          this.currentIncomeData = response;
          this.incomeForm.patchValue({
            month: response.month,
            year: response.year,
            amount: response.amount,
            categoryId: response.categoryId,
            type: response.type
          });
          this.generateYearList();
        },
        error: (error) => {
          console.error('Error fetching income data:', error);
          this.errorMessage = 'Failed to load income data.';
        }
      });
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

    this.http.get<Category[]>('http://localhost:5030/api/categories/income', { headers })
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

          this.incomeForm.patchValue({
            month: this.currentMonth,
            year: this.currentYear
          });

          this.generateYearList();
        },
        error: (error) => {
          console.error('Error fetching current date:', error);
          const today = new Date();
          this.currentMonth = today.getMonth() + 1;
          this.currentYear = today.getFullYear();

          this.incomeForm.patchValue({
            month: this.currentMonth,
            year: this.currentYear
          });

          this.generateYearList();
        }
      });
  }

  generateYearList(): void {
    this.yearOptions = [];
    for (let year = 2025; year <= 2035; year++) {
      this.yearOptions.push(year);
    }
  }

  onSubmit(): void {
    if (this.incomeForm.valid) {
      const token = localStorage.getItem('token');
      if (!token) {
        this.errorMessage = 'You must be logged in to add/update income.';
        return;
      }

      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });

      const userId = this.getUserIdFromToken(token);
      const incomeData = {
        ...this.incomeForm.value,
        userId: userId
      };

      if (this.incomeId) {
        const updatedIncome = {
          ...incomeData,
          id: this.incomeId
        };
        this.http.put(`http://localhost:5030/api/income/${this.incomeId}`, updatedIncome, { headers })
          .subscribe({
            next: (response: any) => {
              this.successMessage = response.message || 'Income updated successfully.';
              this.router.navigate(['/list-income']);
            },
            error: (error) => {
              console.error('Update income error:', error);
              this.errorMessage = error.error?.message || 'Failed to update income.';
            }
          });
      } else {
        this.http.post('http://localhost:5030/api/income', incomeData, { headers })
          .subscribe({
            next: (response: any) => {
              this.successMessage = response.message || 'Income added successfully.';
              this.router.navigate(['/home']);
            },
            error: (error) => {
              console.error('Add income error:', error);
              this.errorMessage = error.error?.message || 'Failed to add income.';
            }
          });
      }
    }
  }

  cancelEdit(): void {
    this.router.navigate(['/list-income']);
  }
}