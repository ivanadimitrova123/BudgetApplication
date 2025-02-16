import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../shared-components/navbar/navbar.component';
import { AppComponent } from './app.component';
import { ExpenseComponent } from '../components/expense/expense.component';
import { HomeComponent } from '../components/home/home.component';
import { IncomeComponent } from '../components/income/income.component';
import { ListExpensesComponent } from '../components/list-expenses/list-expenses.component';
import { ListIncomesComponent } from '../components/list-incomes/list-incomes.component';
import { LoginComponent } from '../auth/login/login.component';
import { RegisterComponent } from '../auth/register/register.component';
import { HttpClientModule } from '@angular/common/http';
import { routes } from '../app/app.routes';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        AppComponent,
        ExpenseComponent,
        HomeComponent,
        IncomeComponent,
        ListExpensesComponent,
        ListIncomesComponent,
        LoginComponent,
        RegisterComponent,
        NavbarComponent
    ],
    imports: [
        BrowserModule,
        NgbModule,
        RouterModule.forRoot(routes),
        HttpClientModule,
        CommonModule,
        ReactiveFormsModule,
        NgbTypeaheadModule,
        FormsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
