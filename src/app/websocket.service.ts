import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class WebsocketService {
  private socket = io('http://localhost:5000'); // adapte si différent

  listen(eventName: string) {
    return new Observable(observer => {
      this.socket.on(eventName, (data) => {
        observer.next(data);
      });
    });
  }
}