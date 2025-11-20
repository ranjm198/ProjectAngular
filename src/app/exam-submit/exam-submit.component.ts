import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-exam-submit',
  templateUrl: './exam-submit.component.html',
  styleUrls: ['./exam-submit.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ExamSubmitComponent implements OnInit {
  exams: any[] = [];
  selectedFile!: File;
  selectedExamId = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.get<any[]>('http://localhost:5000/api/exam/', { headers }).subscribe({
      next: (data) => this.exams = data,
      error: (err) => console.error('Erreur lors de la récupération des examens:', err)
    });
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.selectedFile = file;
    } else {
      alert('Veuillez sélectionner un fichier PDF valide.');
      event.target.value = ''; // Reset input
    }
  }

  submitResponse(): void {
    if (!this.selectedExamId || !this.selectedFile) {
      alert('Veuillez sélectionner un examen et téléverser un fichier PDF.');
      return;
    }

    const formData = new FormData();
    formData.append('examId', this.selectedExamId);
    formData.append('pdf', this.selectedFile);

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.post('http://localhost:5000/api/exam/submit', formData, { headers }).subscribe({
      next: () => {
        alert('✅ Réponse envoyée avec succès');
        // Reset form
        this.selectedFile = undefined!;
        this.selectedExamId = '';
      },
      error: (err) => {
        console.error('❌ Erreur lors de l’envoi :', err);
        alert('Erreur lors de la soumission : ' + (err.error?.message || 'Inconnue'));
      }
    });
  }
}
