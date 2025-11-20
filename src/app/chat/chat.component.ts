import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Message } from '../models/message.model';
import { ChatService } from '../chat.service';
import { SocketService } from '../socket.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
 enseignants: any[] = [];

  constructor(private chatService: ChatService, private router: Router) {}

  ngOnInit(): void {
    this.chatService.getEnseignants().subscribe((res: any) => {
      this.enseignants = res;
    });
  }

  discuterAvec(enseignantId: string) {
    this.router.navigate(['/chat-room', enseignantId]);
  }
}