import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GeminiChatService {

  // Pon tu API Key real aquí
  private readonly API_KEY = 'AIzaSyARYjbpblkkfNY9QvmBHoMyoKdqb7DzjIo';

  private readonly GEMINI_API_URL =
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + this.API_KEY;

  constructor(private http: HttpClient) {}

  sendMessage(message: string): Observable<string> {
    const prompt = "Eres un asistente virtual de una pagina de reserva de rutas, no das respuestas que no sean relacionadas a turismo, quis de viaje, rutas, entre otros. ";
    const body = {
      contents: [
        {
          parts: [
            {
              text: `${prompt} ${message}`
            }
          ]
        }
      ]
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(this.GEMINI_API_URL, body, { headers }).pipe(
      map((res: any) => res?.candidates?.[0]?.content?.parts?.[0]?.text || 'Sin respuesta')
    );
  }
}
