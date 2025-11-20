// models/message.model.ts
export interface Message {
  from: string;
  to: string;
  text: string;
  timestamp: Date;
}
