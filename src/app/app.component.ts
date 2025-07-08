import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GeminiChatComponent } from "./components/gemini-chat/gemini-chat.component";
import { MenuComponent } from "./components/menu/menu.component";
import { HomeComponent } from "./components/home/home.component";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MenuComponent,
    GeminiChatComponent,
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Peruvian-Transport-Solutions-FrontEnd';
}

