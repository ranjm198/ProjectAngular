import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { Breadcrumb } from 'primeng/breadcrumb';
import { CardModule } from 'primeng/card';
import { BadgeModule } from 'primeng/badge';
import { ProgressBarModule } from 'primeng/progressbar';
import { FileUploadModule } from 'primeng/fileupload';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [Breadcrumb, RouterModule,
      FormsModule,
   
      FileUploadModule,
      HttpClientModule,
    CardModule,
    BadgeModule,
    ProgressBarModule,
    ToastModule,
    CommonModule, ReactiveFormsModule, InputTextModule, PasswordModule, ButtonModule,ToastModule ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [MessageService]
}) 
export class ProfileComponent {
  profileForm: FormGroup;
  items: MenuItem[] | undefined;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private messageService: MessageService
  ) {
    this.profileForm = this.fb.group({
      username: [''],
      email: [''],
      password: ['']
    });

    this.loadUserData();
  }

  loadUserData() {
    const token = localStorage.getItem('token');
    if (token) {
      this.http.get<any>('http://localhost:5000/api/auth/me', {
        headers: new HttpHeaders({ Authorization: `Bearer ${token}` })
      }).subscribe(data => {
        this.profileForm.patchValue({
          username: data.username,
          email: data.email  // Ajout ici
        });
        
      });
    }
  }

  onSubmit() {
    const token = localStorage.getItem('token');
    if (!token) return;
  
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    const body = this.profileForm.value;
  
    this.http.put('http://localhost:5000/api/auth/update', body, { headers }).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Profil mis à jour' });
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Échec de la mise à jour' });
      }
    });
  }
  ngOnInit(){
     this.items = [{ icon: 'pi pi-home', route: '/installation' }, { label: 'Home', route: '/inputtext' }, { label: 'Dashboard', route: '/dashboard' }, { label: 'Edit Profil', route: '/profile' }];
  }
}
