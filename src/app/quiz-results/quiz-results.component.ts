import { Component, OnInit } from '@angular/core';
import { QuizService } from '../quiz.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-quiz-results',
  templateUrl: './quiz-results.component.html',
  styleUrls: ['./quiz-results.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class QuizResultsComponent implements OnInit {
  results: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchResults();
  }

  fetchResults() {
    this.http.get<any[]>('http://localhost:5000/api/quiz/results').subscribe((data) => {
      this.results = data;
    });
  }
}