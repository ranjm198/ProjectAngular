import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { Breadcrumb } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FileUploadModule } from 'primeng/fileupload';
import { CardModule } from 'primeng/card';
import { BadgeModule } from 'primeng/badge';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { StepperModule } from 'primeng/stepper';

import { jwtDecode } from 'jwt-decode';
import { AuthService } from '../../auth.service';
import { WebsocketService } from '../../websocket.service';
import { ConfirmDialog } from 'primeng/confirmdialog';

@Component({
  standalone: true,
  selector: 'app-add-cours',
  templateUrl: './add-cours.component.html',
  styleUrl: './add-cours.component.css',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    Breadcrumb,
    ButtonModule,
    InputTextModule,
    FileUploadModule,
    HttpClientModule,
    CardModule,
    BadgeModule,
    ProgressBarModule,
    ToastModule,
    StepperModule,
  ],
 providers: [ConfirmationService, MessageService]})
export class AddCoursComponent {
  items: any[] | undefined;
  home: any;
  username = '';
  role = '';
  isSidebarCollapsed = false;
  sidebarOpen = true;
  dropdownOpen = false;
  profileDropdownOpen = false;
  notifications: { message: string; timestamp: Date }[] = [];

  nomCours = '';
  matiere = '';
  pdfFile: File | null = null;
  totalSize = 0;

  step = 1;

  constructor(
    private messageService: MessageService,
    private http: HttpClient,
    private router: Router,
    private auth: AuthService,
    private socketService: WebsocketService,
    private confirmationService: ConfirmationService,
  ) {}

  ngOnInit(): void {
    const token = this.auth.getToken();
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        this.username = decoded.username;
      } catch (error) {
        this.router.navigate(['/login']);
      }
    } else {
      this.router.navigate(['/login']);
    }

    this.items = [
      { icon: 'pi pi-home', route: '/installation' },
      { label: 'Home', route: '/inputtext' },
      { label: 'Courses', route: '/dashboard' },
      { label: 'Add courses', route: '/add-cours' },
    ];

    this.socketService.listen('nouveau-cours').subscribe((data: any) => {
      this.notifications.unshift({
        message: data.message,
        timestamp: new Date(),
      });
    });
  }

  onFileChange(event: any) {
    this.pdfFile = event.target.files[0];
    if (this.pdfFile) {
      this.totalSize = this.pdfFile.size;
    }
  }

  submit() {
    if (!this.nomCours || !this.matiere || !this.pdfFile) {
      alert('All fields are required.');
      return;
    }

    const formData = new FormData();
    formData.append('nomCours', this.nomCours);
    formData.append('matiere', this.matiere);
    formData.append('pdf', this.pdfFile);

    const token = localStorage.getItem('token') || '';
    this.http.post('http://localhost:5000/api/courses/add', formData, {
      headers: { Authorization: `Bearer ${token}` },
    }).subscribe({
      next: () => {
        alert('Cours ajouté avec succès');
        this.nomCours = '';
        this.matiere = '';
        this.pdfFile = null;
        this.totalSize = 0;
        this.step = 1; // reset stepper
      },
      error: err => alert(err.error.message),
    });
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
    this.profileDropdownOpen = false;
  }

  toggleProfileDropdown() {
    this.profileDropdownOpen = !this.profileDropdownOpen;
    this.dropdownOpen = false;
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  formatSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }}