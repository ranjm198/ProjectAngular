// src/app/chat/chat-room/chat-room.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SocketService } from '../socket.service';
import { ChatService } from '../chat.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class ChatRoomComponent implements OnInit, OnDestroy {
  messages: any[] = [];
  message = '';
  currentUserId = 'etu-id'; // à remplacer dynamiquement
  enseignantId!: string;

  constructor(
    private route: ActivatedRoute,
    private socketService: SocketService,
    private chatService: ChatService
  ) {}

  ngOnInit(): void {
    this.enseignantId = this.route.snapshot.paramMap.get('id')!;
    const roomId = [this.currentUserId, this.enseignantId].sort().join('_');

    this.socketService.connect();
    this.socketService.joinRoom(roomId);

    this.socketService.onMessage((msg) => {
      this.messages.push(msg);
    });

    // charger les anciens messages
    this.chatService.getMessages(roomId).subscribe((res: any) => {
      this.messages = res;
    });
  }

  sendMessage() {
    const msg = {
      from: this.currentUserId,
      to: this.enseignantId,
      content: this.message,
      roomId: [this.currentUserId, this.enseignantId].sort().join('_')
    };

    this.chatService.sendMessage(msg).subscribe();
    this.socketService.sendMessage(msg);
    this.message = '';
  }

  ngOnDestroy(): void {
    this.socketService.disconnect();
  }
}
