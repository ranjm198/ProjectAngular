import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [
    CardModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    DividerModule,
    FormsModule,
    HttpClientModule,
    CommonModule
  ]
})
export class LoginComponent {  username = '';
  password = '';

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    this.auth.login({ username: this.username, password: this.password })
      .subscribe({
        next: (res: any) => {
          this.auth.saveToken(res.token);
          if (res.role === 'etudiant') {
            this.router.navigate(['/dashboard']);
          } else {
            this.router.navigate(['/dashboard']);
          }
        },
        error: err => alert(err.error.message)
      });
  }
}

