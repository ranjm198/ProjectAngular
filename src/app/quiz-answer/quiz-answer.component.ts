import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';

@Component({
  selector: 'app-quiz-answer',
  standalone: true,
  imports: [CommonModule, FormsModule,  Breadcrumb,
    RouterModule],
    templateUrl: './quiz-answer.component.html',
  styleUrl: './quiz-answer.component.css'
})
export class QuizAnswerComponent {
  quizId!: string;
  quiz: any;
  answers: number[] = [];
 items: MenuItem[] | undefined;
  sidebarOpen = true;
  home: MenuItem | undefined;

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }
  constructor(private route: ActivatedRoute, private http: HttpClient,    private router: Router,
  ) {}

  ngOnInit(): void {
    this.quizId = this.route.snapshot.paramMap.get('quizId')!; // récupère id depuis l'URL
    this.loadQuiz();
    this.items = [{ icon: 'pi pi-home', route: '/installation' }, { label: 'Home', route: '/inputtext' }, { label: 'Dashboard', route: '/dashboard' }, { label: 'Add Courses', route: '/add-cours' }];

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
        next: (response) => {
          console.log('Réponses envoyées', response);
          alert('Quiz terminé ! Score : ' + (response as any).score);
        },
        error: (error) => {
          console.error('Erreur lors de l\'envoi des réponses', error);
        }
      });
  }

  selectAnswer(questionIndex: number, optionIndex: number) {
    this.answers[questionIndex] = optionIndex;
  }
  
}