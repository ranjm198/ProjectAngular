import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { MenuItem, MessageService } from 'primeng/api';
import { AuthService } from '../auth.service';
import { WebsocketService } from '../websocket.service';
import { CardModule } from 'primeng/card';
import { Breadcrumb } from 'primeng/breadcrumb';
import { InputTextModule } from 'primeng/inputtext';
import { SidebarModule } from 'primeng/sidebar';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-exam-upload',
  templateUrl: './exam-upload.component.html',
  styleUrls: ['./exam-upload.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    TableModule,
        CardModule,
        ButtonModule,
        CommonModule,
        Breadcrumb,
        RouterModule,
        InputTextModule,
        FormsModule,
        ToastModule,
        SidebarModule,
        ButtonModule,
        CardModule,
        ButtonModule, InputTextModule
      ],
      providers: [MessageService],
  
})
export class ExamUploadComponent {
  submissions: any[] = [];
  message: string = '';
  showDialog: boolean = false;

  examForm: FormGroup;
  selectedFile: File | null = null;
  successMsg: string = '';
  errorMsg: string = '';
 isSidebarCollapsed = false;
  role: string = '';
  items: MenuItem[] = [];
  home: MenuItem | undefined;
  courses: any[] = [];
  filteredCourses: any[] = [];
  searchTerm: string = '';
  username: string = '';
  sidebarOpen = true;
  notifications: { message: string; timestamp: Date }[] = [];
  dropdownOpen = false;
  profileDropdownOpen = false;
  visible: boolean = false;

   
  goToProfile() {
  this.router.navigate(['/profile']); // remplacez '/profile' par le vrai chemin de votre page profil
}
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
  constructor(private http: HttpClient, private fb: FormBuilder,
     private auth: AuthService,
        private router: Router,
        private socketService: WebsocketService,
        private messageService: MessageService  
  ) {
    this.examForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      pdf: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadSubmissions();
     this.items = [{ icon: 'pi pi-home', route: '/installation' }, { label: 'Home', route: '/inputtext' }, { label: 'Exames', route: '/dashboard' }, { label: 'Add exames', route: '/add-cours' }];
    this.socketService.listen('nouveau-cours').subscribe((data: any) => {
      this.notifications.unshift({
        message: data.message,
        timestamp: new Date()
      });
    });
    
    
  }

  onSidebarToggle() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }
  loadSubmissions(): void {
    const token = localStorage.getItem('token');
    this.http.get<any>('http://localhost:5000/api/exam/submissions', {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    }).subscribe({
      next: (res) => {
        this.submissions = res.submissions;
        this.message = res.message;
      },
      error: (err) => {
        this.message = err.error.message || 'Erreur lors du chargement.';
      }
    });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    this.examForm.patchValue({ pdf: this.selectedFile });
  }

  onSubmit(): void {
    if (this.examForm.invalid || !this.selectedFile) {
      this.errorMsg = 'Veuillez remplir tous les champs et sélectionner un fichier PDF.';
      return;
    }

    const formData = new FormData();
    formData.append('title', this.examForm.get('title')?.value);
    formData.append('description', this.examForm.get('description')?.value);
    formData.append('pdf', this.selectedFile);

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.post('http://localhost:5000/api/exam/create', formData, { headers }).subscribe({
      next: (res: any) => {
        this.successMsg = 'Examen ajouté avec succès.';
        this.errorMsg = '';
        this.examForm.reset();
        this.selectedFile = null;
        this.showDialog = false;
        this.loadSubmissions();
      },
      error: (err) => {
        this.errorMsg = err.error?.message || 'Erreur serveur';
        this.successMsg = '';
      }
    });
  }

  openDialog() {
    this.successMsg = '';
    this.errorMsg = '';
    this.examForm.reset();
    this.showDialog = true;
  }
}