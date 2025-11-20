import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../auth.service';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { Breadcrumb } from 'primeng/breadcrumb';
import { WebsocketService } from '../../websocket.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-list-cours',
  templateUrl: './list-cours.component.html',
  styleUrls: ['./list-cours.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    ToastModule,
    Breadcrumb,
    RouterModule
  ],
  providers: [MessageService]
})
export class ListCoursComponent {
  myCourses: any[] = [];
  items: MenuItem[] | undefined;
  sidebarOpen = true;
  home: MenuItem | undefined;
  notifications: { message: string; timestamp: Date }[] = [];
  dropdownOpen = false;
  profileDropdownOpen = false;
  username: string = '';
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
  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private router: Router,
    private socketService: WebsocketService,
    private messageService: MessageService    ) {}

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
    this.loadMyCourses();
    this.items = [{ icon: 'pi pi-home', route: '/installation' }, { label: 'Home', route: '/inputtext' }, { label: 'Courses', route: '/dashboard' }, { label: 'Courses list', route: '/add-cours' }];
    this.socketService.listen('nouveau-cours').subscribe((data: any) => {
      this.notifications.unshift({
        message: data.message,
        timestamp: new Date()
      });
    });
    
  }
  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  loadMyCourses() {
    const token = this.auth.getToken();
    this.http.get<any[]>('http://localhost:5000/api/courses/my-courses', {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (data) => this.myCourses = data,
      error: (err) => console.error(err)
    });
  }

  deleteCourse(courseId: string) {
    const token = this.auth.getToken();
    if (!confirm('Voulez-vous vraiment supprimer ce cours ?')) return;

    this.http.delete(`http://localhost:5000/api/courses/${courseId}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Cours supprimé' });
        this.loadMyCourses();
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Erreur lors de la suppression' });
      }
    });
  }
}