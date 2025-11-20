import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuItem, MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { FileUploadModule } from 'primeng/fileupload';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { WebsocketService } from '../websocket.service';
import { AuthService } from '../auth.service';
import { Router, RouterModule } from '@angular/router';
import { Breadcrumb } from 'primeng/breadcrumb';

@Component({
  selector: 'app-exam-list',
  templateUrl: './exam-list.component.html',
  styleUrls: ['./exam-list.component.css'],
standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    ToastModule,
    ButtonModule,
    InputTextModule,
    FileUploadModule,
    DropdownModule,
     Breadcrumb,
         RouterModule,
     
  ],

    providers: [MessageService]

})
export class ExamListComponent implements OnInit {
 exams: any[] = [];
  displayDialog = false;
  selectedExam: any = null;
  selectedFile!: File;
  username: string = '';
  sidebarOpen = true;
  notifications: { message: string; timestamp: Date }[] = [];
  dropdownOpen = false;
  profileDropdownOpen = false;
  visible: boolean = false;
  isSidebarCollapsed = false;
  role: string = '';
  items: MenuItem[] = [];
  home: MenuItem | undefined;

    showDialog() {
        this.visible = true;
    }
  goToProfile() {
  this.router.navigate(['/profile']); // remplacez '/profile' par le vrai chemin de votre page profil
}
  constructor(
    private auth: AuthService,
    private router: Router,
    private http: HttpClient,
    private socketService: WebsocketService,
    private messageService: MessageService  
  ) {}  
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
  ngOnInit(): void {
    this.loadExams();
    this.items = [{ icon: 'pi pi-home', route: '/installation' }, { label: 'Home', route: '/inputtext' }, { label: 'Exames', route: '/dashboard' }, { label: 'List exames', route: '/add-cours' }];
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

  navigateTo(path: string) {
    this.router.navigate([path]);
  }
  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
  loadExams() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.get<any[]>('http://localhost:5000/api/exam/', { headers }).subscribe({
      next: data => this.exams = data,
      error: err => console.error('Erreur de chargement des examens :', err)
    });
  }

  openDialog(exam: any) {
    this.selectedExam = exam;
    this.displayDialog = true;
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file?.type === 'application/pdf') {
      this.selectedFile = file;
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Fichier invalide', detail: 'Veuillez choisir un fichier PDF.' });
    }
  }

  submitExam() {
    if (!this.selectedExam || !this.selectedFile) return;

    const formData = new FormData();
    formData.append('examId', this.selectedExam._id);
    formData.append('pdf', this.selectedFile);

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.post('http://localhost:5000/api/exam/submit', formData, { headers }).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Réponse envoyée avec succès.' });
        this.displayDialog = false;
        this.selectedFile = undefined!;
      },
      error: err => {
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.error?.message || 'Erreur inconnue' });
      }
    });
  }
}