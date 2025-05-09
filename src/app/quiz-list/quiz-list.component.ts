import { Component } from '@angular/core';
import { QuizService } from '../quiz.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { WebsocketService } from '../websocket.service';
import { AuthService } from '../auth.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-quiz-list',
  standalone: true,
  imports: [CommonModule, FormsModule,    Breadcrumb,RouterModule
  ],
  providers: [MessageService],

    templateUrl: './quiz-list.component.html',
  styleUrl: './quiz-list.component.css'
})
export class QuizListComponent {
  quizzes: any[] = [];
  sidebarOpen = true;
 items: MenuItem[] = [];
   home: MenuItem | undefined;
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

  constructor(private http: HttpClient, private router: Router,
       private socketService: WebsocketService,
        private messageService: MessageService ,
            private auth: AuthService,
         
  ) {}

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
    this.loadQuizzes();
    this.items = [{ icon: 'pi pi-home', route: '/installation' }, { label: 'Home', route: '/inputtext' }, { label: 'Quiz', route: '/dashboard' }, { label: 'List Quiz', route: '/add-cours' }];
    this.socketService.listen('nouveau-cours').subscribe((data: any) => {
      this.notifications.unshift({
        message: data.message,
        timestamp: new Date()
      });
    });
  }

  loadQuizzes() {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.get<any[]>('http://localhost:5000/api/quiz', { headers })
      .subscribe({
        next: (data) => {
          this.quizzes = data;
        },
        error: (error) => {
          console.error('Erreur lors du chargement des quizzes', error);
        }
      });
    }
  startQuiz(quizId: string) {
    this.router.navigate(['/quiz-answer', quizId]);
  }
}