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
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-quiz-list',
  standalone: true,
  imports: [CommonModule, FormsModule,Breadcrumb,RouterModule,DialogModule
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
// Ajouter dans QuizListComponent (en haut dans la classe)
selectedQuizId: string = '';
showMiniGame: boolean = false;
gameQuestion: string = '';
userGameAnswer: string = '';
gameSuccess: boolean = false;

// Liste de questions simples (algorithmes de base)
algorithmGames = [
  { question: 'Quel est le résultat de 5 + 3 * 2 ?', answer: '11' },
  { question: 'Combien vaut factorial(3) ?', answer: '6' },
  { question: 'Quel est le plus grand entre 8, 12, et 5 ?', answer: '12' },
  { question: 'Combien y a-t-il de bits dans un octet ?', answer: '8' },
  { question: 'Résultat de 2^4 ?', answer: '16' }
];

// Choix aléatoire
getRandomGame() {
  const randomIndex = Math.floor(Math.random() * this.algorithmGames.length);
  return this.algorithmGames[randomIndex];
}

// Quand on clique sur un quiz
attemptQuiz(quizId: string) {
  this.selectedQuizId = quizId;
  const game = this.getRandomGame();
  this.gameQuestion = game.question;
  this.gameSuccess = false;
  this.userGameAnswer = '';
  this.showMiniGame = true;
}

// Vérifie la réponse
checkGameAnswer() {
  const correct = this.algorithmGames.find(q => q.question === this.gameQuestion)?.answer;
  if (this.userGameAnswer.trim() === correct) {
    this.gameSuccess = true;
    this.showMiniGame = false;
    this.router.navigate(['/quiz-answer', this.selectedQuizId]);
  } else {
    this.messageService.add({ severity: 'error', summary: 'Incorrect', detail: 'Mauvaise réponse. Essayez encore.' });
  }
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
    this.items = [{ icon: 'pi pi-home', route: '/installation' }, { label: 'Home', route: '/inputtext' }, { label: 'Quiz', route: '/dashboard' }, { label: 'List quiz', route: '/add-cours' }];
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