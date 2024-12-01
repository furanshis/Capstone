import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {

  // private apiUrl = environment.apiUrl + '/chatbot-admin';

  private apiUrl = 'http://192.168.1.85:3000/chatbot-admin';

  constructor(private http: HttpClient) { }

  getChatbotResponse(userMessage: string): Promise<string> {
    return this.http
      .post<{ response: string }>(this.apiUrl, { message: userMessage })
      .toPromise()
      .then((res) => {
        if (res && res.response) {
          return res.response; // Asegurarse de que `res` y `res.response` existen.
        }
        throw new Error('Respuesta inesperada del servidor');
      })
      .catch((err) => {
        console.error('Error al obtener la respuesta del chatbot:', err);
        throw err;
      });
  }
}
