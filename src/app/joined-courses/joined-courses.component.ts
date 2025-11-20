import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { AuthService } from '../auth.service';
import { WebsocketService } from '../websocket.service';
import { Breadcrumb } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-joined-courses',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    ToastModule,
    Breadcrumb,
    RouterModule,
    FormsModule
  ],
  providers: [MessageService],
  templateUrl: './joined-courses.component.html',
  styleUrls: ['./joined-courses.component.css']
})
export class JoinedCoursesComponent implements OnInit {
   joinedCourses: any[] = [];
  filteredCourses: any[] = [];
  searchTerm: string = '';
items: MenuItem[] | undefined;
  sidebarOpen = true;
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
  constructor(private http: HttpClient, private messageService: MessageService,
        private auth: AuthService,
        private router: Router,
        private socketService: WebsocketService,
  ) {}

  ngOnInit(): void {
  const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any[]>('http://localhost:5000/api/courses/joined-courses', { headers }).subscribe({
      next: (data) => {
        this.joinedCourses = data;
        this.filteredCourses = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des cours rejoints', err);
      }
    });
     this.items = [{ icon: 'pi pi-home', route: '/installation' }, { label: 'Home', route: '/inputtext' }, { label: 'Courses', route: '/dashboard' }, { label: 'Courses joined', route: '/add-cours' }];
    this.socketService.listen('nouveau-cours').subscribe((data: any) => {
      this.notifications.unshift({
        message: data.message,
        timestamp: new Date()
      });
    });
  }

  onSearch(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredCourses = this.joinedCourses.filter(c =>
      c.courseId?.nomCours?.toLowerCase().includes(term) ||
      c.courseId?.matiere?.toLowerCase().includes(term)
    );
  }
  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

 
}