import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { Router, RouterModule } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FileUploadModule } from 'primeng/fileupload';
import { CardModule } from 'primeng/card';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BadgeModule } from 'primeng/badge';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from '../../auth.service';
import { WebsocketService } from '../../websocket.service';
@Component({
  standalone:true,
  selector: 'app-add-cours',
  imports: [Breadcrumb, RouterModule,CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    FileUploadModule,
    HttpClientModule,
  CardModule,
  BadgeModule,
  ProgressBarModule,
  ToastModule,
  ],
  providers: [MessageService],

  templateUrl: './add-cours.component.html',
  styleUrl: './add-cours.component.css'
})
export class AddCoursComponent {
  items: MenuItem[] | undefined;
  role: string = '';
  isSidebarCollapsed = false;
  username: string = '';

  home: MenuItem | undefined;
  sidebarOpen = true;
  notifications: { message: string; timestamp: Date }[] = [];
  dropdownOpen = false;
  profileDropdownOpen = false;
  
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
  const token = this.auth.getToken();

  if (token) {
    try {
      const decoded: any = jwtDecode(token);
      this.username = decoded.username; // ✅ On récupère le username
    } catch (error) {
      this.router.navigate(['/login']);
    }
  } else {
    this.router.navigate(['/login']);
  }
    {    this.items = [{ icon: 'pi pi-home', route: '/installation' }, { label: 'Home', route: '/inputtext' }, { label: 'Courses', route: '/dashboard' }, { label: 'Add courses', route: '/add-cours' }];
  }
  this.socketService.listen('nouveau-cours').subscribe((data: any) => {
    this.notifications.unshift({
      message: data.message,
      timestamp: new Date()
    });
  });
  
  }


 /* ngOnInit() {
    this.items = [{ icon: 'pi pi-home', route: '/installation' }, { label: 'Home', route: '/inputtext' }, { label: 'Dashboard', route: '/inputtext' }, { label: 'Add Courses', route: '/inputtext' }];
}*/
  course = {
    name: '',
    teacher: '',
    pdf: null
  };

  onSubmit(form: any) {
    if (form.valid) {
      // Logique pour envoyer les données du formulaire
      console.log(this.course);
      // Vous pouvez envoyer ces données à un serveur ou les enregistrer
    }
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
  totalSize: number = 0;

  constructor(private messageService: MessageService,private http: HttpClient,private router: Router,private auth: AuthService,    private socketService: WebsocketService,
  ) {}

  onTemplatedUpload() {
    this.messageService.add({ severity: 'info', summary: 'Success', detail: 'Uploaded Files !' });
  }

  onSelectedFiles(event: any) {
    this.totalSize = 0;
    for (let file of event.files) {
      this.totalSize += file.size;
    }
  }

  get totalSizePercent(): number {
    return (this.totalSize / 1000000) * 100; // max 1MB
  }

  choose(event: any, callback: any) {
    callback();
  }

  uploadEvent(callback: any) {
    callback();
  }

  formatSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  onRemoveTemplatingFile(event: any, file: any, callback: any, index: number) {
    callback(index);
    this.totalSize -= file.size;
  }
  nomCours = '';
  matiere = '';
  pdfFile: File | null = null;


  onFileChange(event: any) {
    this.pdfFile = event.target.files[0];
  }
  navigateTo(path: string) {
    this.router.navigate([path]);
  }
  submit() {
    if (!this.pdfFile) return alert("PDF requis");

    const formData = new FormData();
    formData.append('nomCours', this.nomCours);
    formData.append('matiere', this.matiere);
    formData.append('pdf', this.pdfFile);

    const token = localStorage.getItem('token') || '';
    this.http.post('http://localhost:5000/api/courses/add', formData, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: () => alert('Cours ajouté'),
      error: err => alert(err.error.message)
    });
  }

}
