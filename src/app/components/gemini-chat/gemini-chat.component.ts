import { Component } from '@angular/core';
import { GeminiChatService } from '../../services/GeminiChat.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gemini-chat',
  imports: [FormsModule, CommonModule],
  templateUrl: './gemini-chat.component.html',
  styleUrl: './gemini-chat.component.css'
})
export class GeminiChatComponent {
  chatOpen = false;
  userInput = '';
  messages: string[] = [];

  constructor(private gemini: GeminiChatService) {}

  toggleChat() {
    this.chatOpen = !this.chatOpen;
  }

  send() {
    if (!this.userInput.trim()) return;

    this.messages.push(`Tú: ${this.userInput}`);

    this.gemini.sendMessage(this.userInput).subscribe(res => {
      this.messages.push(`Gemini: ${res}`);
    });

    this.userInput = '';
  }
}
