import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { QuizService } from '../quiz.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MenuItem, MessageService } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { WebsocketService } from '../websocket.service';
import { AuthService } from '../auth.service';
import { jwtDecode } from 'jwt-decode';
import { Tooltip } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-quiz-create',
  templateUrl: './quiz-create.component.html',
  styleUrls: ['./quiz-create.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule,    Breadcrumb,Tooltip,InputTextModule
  ],
    providers: [MessageService],
  
})
export class QuizCreateComponent {
  title: string = '';
  questions: any[] = [];
 items: MenuItem[] | undefined;
  sidebarOpen = true;
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
  constructor(private http: HttpClient,    private router: Router,
       private socketService: WebsocketService,
        private messageService: MessageService  ,
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
  
    this.items = [{ icon: 'pi pi-home', route: '/installation' }, { label: 'Home', route: '/inputtext' }, { label: 'Quiz', route: '/dashboard' }, { label: 'Create quiz', route: '/add-cours' }];
    this.socketService.listen('nouveau-cours').subscribe((data: any) => {
      this.notifications.unshift({
        message: data.message,
        timestamp: new Date()
      });
    });
  }
  goToProfile() {
  this.router.navigate(['/profile']); // remplacez '/profile' par le vrai chemin de votre page profil
}
  createQuiz() {
    const token = localStorage.getItem('token'); // récupère ton JWT depuis le localStorage

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const body = {
      title: this.title,
      questions: this.questions
    };

    this.http.post('http://localhost:5000/api/quiz/create', body, { headers })
      .subscribe({
        next: (response) => {
          console.log('Quiz créé avec succès', response);
        },
        error: (error) => {
          console.error('Erreur lors de la création du quiz', error);
        }
      });
  }

  addQuestion() {
  this.questions.push({
    question: '',
    options: ['', '', '', ''], // 4 options vides
    correctAnswer: 0
  });
}

removeQuestion(index: number) {
  this.questions.splice(index, 1);
}

}