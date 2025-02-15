import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { catchError, debounceTime, distinctUntilChanged, finalize, Observable, of, OperatorFunction, switchMap, tap } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    RouterModule,
    NgbTypeaheadModule,
    CommonModule,
    FormsModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  userForm: FormGroup;
  searching = false;
  searchFailed = false;
  isUpdateMode: boolean = false; 

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute 

  ) {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      passwordHash: ['', [Validators.minLength(6)]], 
      email: ['', [Validators.required, Validators.email]],
      cityId: ['', Validators.required],
      cityname: [''],
      positionId: ['', Validators.required],
      positionName: [''],
      yearsInPosition: ['', [Validators.required, Validators.min(0)]],
      yearsInExperience: ['', [Validators.required, Validators.min(0)]],
      isUserActive: [false]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isUpdateMode = true;
        this.loadUserData(params['id']); 
      }
    });
  }

  loadUserData(userId: string) {
    this.http.get(`http://localhost:5030/api/users/${userId}`).subscribe((user: any) => {
      console.log('User data loaded:', user);

      this.userForm.patchValue({
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        cityId: user.cityId,
        cityname: user.cityname,
        positionId: user.positionId,
        positionName: user.positionName,
        yearsInPosition: user.yearsInPosition,
        yearsInExperience: user.yearsInExperience,
        isUserActive: user.isUserActive,
        passwordHash: this.isUpdateMode ? '' : user.passwordHash  
              });
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      const formData = { ...this.userForm.value };
  
      if (this.isUpdateMode) {
        delete formData.passwordHash;
      }
  
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  
      if (this.isUpdateMode) {
        const userId = this.route.snapshot.params['id']; 
        this.http.put(`http://localhost:5030/api/users/${userId}`, formData, { headers })
          .subscribe(response => {
            this.router.navigate(['/home']);
          }, error => {
            console.error('Error', error);
          });
      } else {
        this.http.post('http://localhost:5030/api/users/register', formData, { headers })
          .subscribe(response => {
            this.router.navigate(['/login']);
          }, error => {
            console.error('Error', error);
          });
      }
    }
  }
  

  searchPosition: OperatorFunction<string, readonly any[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.searching = true),
      switchMap(term =>
        term.length < 2 ? of([]) :
          this.http.get<any[]>(`http://localhost:5030/api/position/search/${term}`).pipe(
            tap(() => this.searchFailed = false),
            catchError(() => {
              this.searchFailed = true;
              return of([]);
            }),
            finalize(() => this.searching = false)
          )
      ),
      tap(() => this.searching = false)
    );

  formatter = (result: any) => result.name;

  onPositionSelect(event: any): void {
    this.userForm.patchValue({
      positionId: event.item.id,
      positionName: event.item.name
    });
  }

  searchCity: OperatorFunction<string, readonly any[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => term.length < 2 ? of([]) :
        this.http.get<any[]>(`http://localhost:5030/api/city/search/${term}`).pipe(
          catchError(() => {
            this.searchFailed = true;
            return of([]);
          }))
      )
    );
  
  cityFormatter = (result: any) => result.name;
  
  onCitySelect(event: any): void {
    this.userForm.patchValue({
      cityId: event.item.id,
      cityName: event.item.name
    });
  }
}
