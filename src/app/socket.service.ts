// src/app/services/socket.service.ts
import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({ providedIn: 'root' })
export class SocketService {
  private socket!: Socket;

  constructor() {}

  connect(): void {
    this.socket = io('http://localhost:5000'); // lien direct
  }

  sendMessage(data: any) {
    this.socket.emit('message', data);
  }

  onMessage(callback: (data: any) => void) {
    this.socket.on('message', callback);
  }

  joinRoom(roomId: string) {
    this.socket.emit('join', roomId);
  }

  disconnect(): void {
    this.socket.disconnect();
  }
}
