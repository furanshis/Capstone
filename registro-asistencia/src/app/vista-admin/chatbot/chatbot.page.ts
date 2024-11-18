import { Component, OnInit } from '@angular/core';
import { ChatbotService } from '../../services/chatbot.service';
import { ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.page.html',
  styleUrls: ['./chatbot.page.scss'],
})
export class ChatbotPage implements OnInit {
  messages: { sender: string; content: string }[] = [];
  chatMessages: { text: string; isUser: boolean }[] = [];
  userMessage: string = '';
  userName: string = 'Usuario'; // Valor por defecto

  constructor(
    private chatbotService: ChatbotService,
    private toastController: ToastController,
    private afAuth: AngularFireAuth,
  ) { }

  async ngOnInit() {
     // Obtener el nombre del usuario desde Firebase Authentication
     const user = await this.afAuth.currentUser;
     if (user) {
       this.userName = user.displayName || 'Usuario';
     }
 
     // Mensaje inicial
     this.messages.push({
       sender: 'bot',
       content: `Hola ${this.userName}, soy tu asistente personal. ¡Hazme cualquier pregunta!`,
     });
  }

  async sendMessage() {
    if (this.userMessage.trim() === '') {
      return; // No enviar mensajes vacíos
    }

    // Agregar mensaje del usuario
    this.messages.push({ sender: 'user', content: this.userMessage });

    try {
      // Obtener respuesta del chatbot
      const botResponse = await this.chatbotService.getChatbotResponse(this.userMessage);
      this.messages.push({ sender: 'bot', content: botResponse });
    } catch (err) {
      this.messages.push({ sender: 'bot', content: 'Lo siento, no pude procesar tu solicitud.' });
    }

    this.userMessage = ''; // Limpiar el campo de entrada
  }

}
