import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { MenuItem, MessageService } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { jwtDecode } from 'jwt-decode';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastModule } from 'primeng/toast';
import { SidebarModule } from 'primeng/sidebar';
import { WebsocketService } from '../websocket.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
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
    CardModule
  ],
  providers: [MessageService],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
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
    private auth: AuthService,
    private router: Router,
    private http: HttpClient,
    private socketService: WebsocketService,
    private messageService: MessageService  
  ) {}

  ngOnInit(): void {
    const token = this.auth.getToken();

    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    try {
      const decoded: any = jwtDecode(token);
      this.role = decoded.role;
      this.username = decoded.username;

      this.http.get<any[]>('http://localhost:5000/api/courses', {
        headers: { Authorization: `Bearer ${token}` }
      }).subscribe({
        next: (res) => {
          this.courses = res;
          this.filteredCourses = res; // Initial display of courses
        },
        error: (err) => alert(err.error.message)
      });
    } catch (error) {
      this.router.navigate(['/login']);
    }

    this.items = [{ icon: 'pi pi-home', route: '/installation' }, { label: 'Home', route: '/inputtext' }, { label: 'Dashboard', route: '/dashboard' }, { label: 'Courses', route: '/add-cours' }];
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

  joinCourse(courseId: string) {
    const token = this.auth.getToken();
    if (!token) return;

    this.http.post(`http://localhost:5000/api/courses/join/${courseId}`, {}, {
      headers: new HttpHeaders({ Authorization: `Bearer ${token}` })
    }).subscribe({
      next: (res: any) => {
        this.messageService.add({ severity: 'success', summary: 'Succès', detail: res.message });
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.error.message });
      }
    });
  }

  onSearch() {
    const term = this.searchTerm.toLowerCase();
    this.filteredCourses = this.courses.filter(course =>
      course.nomCours?.toLowerCase().includes(term) ||  // Recherche sur le nom du cours
      course.matiere?.toLowerCase().includes(term) ||   // Recherche sur la matière
      course.professeur?.toLowerCase().includes(term)    // Recherche sur le professeur
    );
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}
