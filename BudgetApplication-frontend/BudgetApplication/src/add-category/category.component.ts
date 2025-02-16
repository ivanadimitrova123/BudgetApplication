import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-category',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent {
  categoryForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      categoryFor: ['', Validators.required]  
    });
  }

  onSubmit(): void {
    if (this.categoryForm.valid) {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
  
      const categoryData = {
        name: this.categoryForm.value.name,
        categoryFor: this.categoryForm.value.categoryFor
      };

      this.http.post('http://localhost:5030/api/categories', categoryData, { headers, responseType: 'json' })
        .subscribe({
          next: (response: any) => {
            this.successMessage = response.message;
            this.errorMessage = '';
            this.categoryForm.reset();
          },
          error: (error) => {
            this.errorMessage = error.error?.message || 'An error occurred while adding the category.';
            this.successMessage = '';
          }
        });
    }
  }
}