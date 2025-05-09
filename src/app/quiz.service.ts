import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private apiUrl = 'http://localhost:5000/api/quiz';

  constructor(private http: HttpClient) {}

  // Créer un quiz (requête POST)
  createQuiz(quizData: { title: string, questions: any[] }): Observable<any> {
    const token = localStorage.getItem('token'); // Récupérer le token JWT depuis le localStorage
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post(`${this.apiUrl}/create`, quizData, { headers });
  }

  // Voir tous les quiz (requête GET)
  getAllQuizzes(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });

    return this.http.get<any[]>(this.apiUrl, { headers });
  }

  // Répondre à un quiz (requête POST)
  answerQuiz(quizId: string, answers: number[]): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post(`${this.apiUrl}/answer/${quizId}`, { answers }, { headers });
  }

  // Voir les résultats du quiz (requête GET)
  getResults(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });

    return this.http.get<any[]>(`${this.apiUrl}/results`, { headers });
  }
}
