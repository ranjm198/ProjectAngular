import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ExamService {
  apiUrl = 'http://localhost:5000/api/exam';

  constructor(private http: HttpClient) {}

  uploadExam(data: FormData) {
    return this.http.post(`${this.apiUrl}/create`, data);
  }

  getExams() {
    return this.http.get<any[]>(`${this.apiUrl}/`);
  }

  submitExam(data: FormData) {
    return this.http.post(`${this.apiUrl}/submit`, data);
  }

  getSubmissions() {
    return this.http.get<any[]>(`${this.apiUrl}/submissions`);
  }
}
