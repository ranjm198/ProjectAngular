// src/app/services/chat.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ChatService {

private apiUrl = 'http://localhost:5000/api/chat';

  constructor(private http: HttpClient) {}

  getDiscussions(userId: string) {
    return this.http.get(`${this.apiUrl}/discussions/${userId}`);
  }

  getMessages(discussionId: string) {
    return this.http.get(`${this.apiUrl}/messages/${discussionId}`);
  }

  sendMessage(data: any) {
    return this.http.post(`${this.apiUrl}/send`, data);
  }

  getEnseignants() {
    return this.http.get(`${this.apiUrl}/enseignants`);
  }
}
