import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-submitted-exams',
  templateUrl: './submitted-exams.component.html',
  styleUrls: ['./submitted-exams.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class SubmittedExamsComponent implements OnInit {
  submissions: any[] = [];
  message: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token'); // 🔐 JWT
    this.http.get<any>('http://localhost:5000/api/exam/submissions', {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    }).subscribe({
      next: (res) => {
        this.submissions = res.submissions;
        this.message = res.message;
      },
      error: (err) => {
        this.message = err.error.message || 'Erreur lors du chargement.';
      }
    });
  }
}