import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { AuthService } from '../auth.service';
import { WebsocketService } from '../websocket.service';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-quiz-answer',
  standalone: true,
  imports: [CommonModule, FormsModule,  Breadcrumb,
    RouterModule,DialogModule],
      providers: [MessageService],

    templateUrl: './quiz-answer.component.html',
  styleUrl: './quiz-answer.component.css'
})
export class QuizAnswerComponent {
  quizId!: string;
  quiz: any;
  answers: number[] = [];
  sidebarOpen = true;
  home: MenuItem | undefined;
  isSidebarCollapsed = false;
  role: string = '';
  items: MenuItem[] = [];
  courses: any[] = [];
  filteredCourses: any[] = [];
  searchTerm: string = '';
  username: string = '';
  notifications: { message: string; timestamp: Date }[] = [];
  dropdownOpen = false;
  profileDropdownOpen = false;
  visible: boolean = false;
  scoreDialogVisible = false;
quizScore: number = 0;

logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

    showDialog() {
        this.visible = true;
    }
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

  constructor(private route: ActivatedRoute, private http: HttpClient,    private router: Router,
     private auth: AuthService,
      private socketService: WebsocketService,
         private messageService: MessageService  
  ) {}

  ngOnInit(): void {
        const token = this.auth.getToken();

    this.quizId = this.route.snapshot.paramMap.get('quizId')!; // récupère id depuis l'URL
    this.loadQuiz();
   
    this.items = [{ icon: 'pi pi-home', route: '/installation' }, { label: 'Home', route: '/inputtext' }, { label: 'Dashboard', route: '/dashboard' }, { label: 'Courses', route: '/add-cours' }];
    this.socketService.listen('nouveau-cours').subscribe((data: any) => {
      this.notifications.unshift({
        message: data.message,
        timestamp: new Date()
      });
    });
  }

  loadQuiz() {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.get<any>(`http://localhost:5000/api/quiz`, { headers })
      .subscribe({
        next: (quizzes) => {
          this.quiz = quizzes.find((q: any) => q._id === this.quizId);
          if (this.quiz) {
            this.answers = new Array(this.quiz.questions.length).fill(-1); // Initialiser réponses à -1
          }
        },
        error: (error) => {
          console.error('Erreur lors du chargement du quiz', error);
        }
      });
  }
submitAnswers() {
  const token = localStorage.getItem('token');

  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  });

  const body = { answers: this.answers };

  this.http.post(`http://localhost:5000/api/quiz/answer/${this.quizId}`, body, { headers })
    .subscribe({
      next: (response: any) => {
        console.log('Réponses envoyées', response);
        this.quizScore = response.score;
        this.scoreDialogVisible = true; // Ouvre le dialogue moderne
      },
      error: (error) => {
        console.error('Erreur lors de l\'envoi des réponses', error);
      }
    });
}


  selectAnswer(questionIndex: number, optionIndex: number) {
    this.answers[questionIndex] = optionIndex;
  }
  
  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}