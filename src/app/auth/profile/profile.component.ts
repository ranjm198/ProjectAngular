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
import { WebsocketService } from '../../websocket.service';
import { AuthService } from '../../auth.service';

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
 sidebarOpen = true;
  notifications: { message: string; timestamp: Date }[] = [];
  dropdownOpen = false;
  profileDropdownOpen = false;
    username: string = '';

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
    this.profileDropdownOpen = false; // Ferme l’autre
  }
  
  toggleProfileDropdown() {
    this.profileDropdownOpen = !this.profileDropdownOpen;
    this.dropdownOpen = false; // Ferme l’autre
  }
  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }
   logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
    goToProfile() {
  this.router.navigate(['/profile']); // remplacez '/profile' par le vrai chemin de votre page profil
}
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private messageService: MessageService,
     private socketService: WebsocketService,
     private auth: AuthService
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
  alert('✅ Succès : Profil mis à jour');
},
error: () => {
  alert('❌ Erreur : Échec de la mise à jour');
}

    });
  }
  ngOnInit(){
    this.items = [{ icon: 'pi pi-home', route: '/installation' }, { label: 'Home', route: '/inputtext' }, { label: 'Profil', route: '/dashboard' }, { label: 'Edite profil', route: '/add-cours' }];
   this.socketService.listen('nouveau-cours').subscribe((data: any) => {
    this.notifications.unshift({
      message: data.message,
      timestamp: new Date()
    });
  }); 
  }
}
