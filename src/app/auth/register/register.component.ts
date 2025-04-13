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

@Component({
  selector: 'app-register',
  imports: [ CommonModule, InputTextModule, ButtonModule, CheckboxModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  ingredient!: string;
  username: string = '';
  email: string = '';
  password: string = '';
  saveDetails: boolean = true;
  newsletter: boolean = false;
}
