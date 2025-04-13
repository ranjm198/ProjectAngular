import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AddCoursComponent } from './cours/add-cours/add-cours.component';
import { ListCoursComponent } from './cours/list-cours/list-cours.component';
import { UpdateCoursComponent } from './cours/update-cours/update-cours.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'add-cours', component: AddCoursComponent },
  { path: 'list-cours', component: ListCoursComponent },
  { path: 'update-cours', component: UpdateCoursComponent },

];
