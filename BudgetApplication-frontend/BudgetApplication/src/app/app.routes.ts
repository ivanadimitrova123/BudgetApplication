import { Routes } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component';
import { HomeComponent } from '../home/home.component';
import { CategoryComponent } from '../add-category/category.component';
import { IncomeComponent } from '../income/income.component';
import { ExpenseComponent } from '../expense/expense.component';
import { ListExpensesComponent } from '../list-expenses/list-expenses.component';
import { ListIncomesComponent } from '../list-incomes/list-incomes.component';

export const routes: Routes = [
    { path: '', redirectTo: 'register', pathMatch: 'full' },
    { path: 'register', component: RegisterComponent },
    { path: 'login', component: LoginComponent },
    { path: 'home', component: HomeComponent },
    { path: 'category', component: CategoryComponent},
    { path: 'income', component: IncomeComponent },
    { path: 'income/:id', component: IncomeComponent },
    { path: 'expense', component: ExpenseComponent },
    { path: 'expense/:id', component: ExpenseComponent },
    { path: 'list-expense', component: ListExpensesComponent },
    { path: 'list-income', component: ListIncomesComponent },
    { path: 'updateUser/:id', component: RegisterComponent } 

];
