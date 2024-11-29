import { Component, OnInit } from '@angular/core';
import { ChatbotService } from '../../services/chatbot.service';
import { ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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
  threadId: string = '';
  selectedFiles: File[] = []; // Archivos seleccionados

  constructor(
    private chatbotService: ChatbotService,
    private toastController: ToastController,
    private afAuth: AngularFireAuth,
    private http: HttpClient,
  ) { }

  async ngOnInit() {
    this.createThread(); // Crear un nuevo hilo en el backend
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

  // Manejar selección de archivos
  onFileSelected(event: any) {
    this.selectedFiles = Array.from(event.target.files);
  }

  async sendMessage() {
    if (!this.userMessage.trim() && this.selectedFiles.length === 0) return; // Evitar mensajes vacíos.
  
    // Agregar el mensaje del usuario al historial.
    this.messages.push({ sender: 'user', content: this.userMessage });
  
    // Agregar un mensaje temporal del bot.
    const processingMessageIndex = this.messages.push({ sender: 'bot', content: 'Procesando...' }) - 1;

    const formData = new FormData();
    formData.append('content', this.userMessage);

    // Agregar archivos al FormData
    this.selectedFiles.forEach((file) => {
      formData.append('files', file, file.name);
    });
  
    try {
      const response: any = await this.http
        .post(
          `http://192.168.1.84:3000/chatbot-admin/thread/${this.threadId}/message`,
          formData,
          { headers: new HttpHeaders(), responseType: 'text' }
        )
        .toPromise();
  
      // Reemplazar el mensaje temporal con la respuesta del chatbot.
      this.messages[processingMessageIndex].content = response;
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
  
      // Reemplazar el mensaje temporal con un mensaje de error.
      this.messages[processingMessageIndex].content = 'Error al procesar la respuesta. Inténtalo nuevamente.';
    }
  
    // Limpiar el input del usuario.
    this.userMessage = '';
    this.selectedFiles = [];
  }
  
  

  // Crear un nuevo hilo en el backend
  async createThread() {
    try {
      const response: any = await this.http
        .post('http://192.168.1.84:3000/chatbot-admin/thread/create', {}, { responseType: 'text' })
        .toPromise();
      this.threadId = response; // Asignar el threadId retornado.
      console.log('Thread creado:', this.threadId);
    } catch (error) {
      console.error('Error al crear el hilo:', error);
    }
  }

  formatMessage(content: string): string {
    // Convertir **texto** a <strong>texto</strong>
    content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
    // Convertir listas numeradas (1., 2., etc.)
    content = content.replace(/(\d+)\. (.+)/g, '<li>$2</li>');
  
    // Envolver las listas en <ol>
    if (content.includes('<li>')) {
      content = `<ol>${content}</ol>`;
    }
  
    // Retornar contenido seguro
    return content;
  }
  
  

}
