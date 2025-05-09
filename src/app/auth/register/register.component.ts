import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { CommonModule } from '@angular/common';
import { RadioButton } from 'primeng/radiobutton';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ CommonModule, InputTextModule, ButtonModule, CheckboxModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  ingredient!: string;

  saveDetails: boolean = true;
  newsletter: boolean = false;

  username = '';
  email = '';
  password = '';
  role = ''; 

  constructor(private auth: AuthService, private router: Router) {}

  register() {
    const userData = {
      username: this.username,
      email: this.email,
      password: this.password,
      role: this.role
    };

    this.auth.register(userData).subscribe({
      next: () => {
        alert('Inscription réussie !');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        alert(err.error.message || 'Erreur lors de l’inscription');
      }
    });
  }

}
