import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable, OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

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

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.incomeForm = this.fb.group({
      year: ['', [Validators.required, Validators.min(2000)]],
      month: ['', Validators.required], // Add month field in the form
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
        this.errorMessage = 'You must be logged in to add income.';
        return;
      }

      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });

      const newIncome = this.incomeForm.value;

      this.http.post('http://localhost:5030/api/income', newIncome, { headers })
        .subscribe({
          next: (response: any) => {
            this.successMessage = response.message || 'Income added successfully.';
            this.errorMessage = '';
            this.incomeForm.reset({ type: 'Real' });
          },
          error: (error) => {
            console.error('Add income error:', error);
            this.errorMessage = error.error?.message || 'Failed to add income.';
            this.successMessage = '';
          }
        });
    }
  }
}
