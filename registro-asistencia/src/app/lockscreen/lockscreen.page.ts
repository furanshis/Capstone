import { Component,OnInit } from '@angular/core';
import { PinService } from 'src/app/services/pin.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { doc, getDoc } from 'firebase/firestore';
import { first } from 'rxjs/operators';





@Component({
  selector: 'app-lockscreen',
  templateUrl: './lockscreen.page.html',
  styleUrls: ['./lockscreen.page.scss'],
})
export class LockscreenPage implements OnInit {
  enteredPin: string = '';
  numbers: string[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
  pinDots: boolean[] = [false, false, false, false]; // Estado de los círculos
  pinpass: string = ''; // PIN almacenado en Firebase
  authService: any;


  goBack() {
    window.history.back();
  }

  constructor(
    private pinService: PinService,
    private router: Router,
    private alertController: AlertController,
    private firestore: AngularFirestore,
    private toastController: ToastController

  ) {}


  async ngOnInit() {

    interface UserData {  
      pinpass: string;
    }

    const uid = localStorage.getItem('uid_empelados'); // Obtén el UID del usuario
    if (uid) {
      try {
        const userDoc = await this.firestore.collection('users').doc(uid).get().toPromise();
        if (userDoc && userDoc.exists) {
          const userData = userDoc.data() as UserData; // Cast a la estructura esperada
          this.pinpass = userData.pinpass; // Accede a `pinpass`
        } else {
          await this.showToast('Error: Usuario no encontrado.', 'danger');
        }
      } catch (error) {
        console.error('Error al obtener el documento:', error);
        await this.showToast('Error al cargar los datos del usuario.', 'danger');
      }
    }
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      color,
      duration: 2000
    });
    toast.present();
  }



  async verifyPin() {
    const userId = this.authService.getCurrentUserId();  // Obtén el ID del usuario actual (esto depende de tu implementación de autenticación)
    const userDocRef = this.firestore.collection('uid_empleado').doc(userId);
    const userDoc = await userDocRef.get().toPromise(); // Convert Observable to Promise
    
    if (userId) { // Now you can access the exists property
      this.pinpass = userId.data().pinpass;  // Obtén el PIN almacenado en Firestore
    
      if (this.enteredPin === this.pinpass) {
        // El PIN es correcto
        this.router.navigate(['/home']);  // Redirige al usuario a la pantalla de inicio
      } else {
        // El PIN es incorrecto
        alert('PIN incorrecto');
        this.clearPin();
      }
    } else {
      // Si no se encuentra el documento del usuario
      alert('Usuario no encontrado');
    }
  }





  addNumber(num: string) {
    if (this.enteredPin.length < 4) {
      this.enteredPin += num;
      this.pinDots[this.enteredPin.length - 1] = true; // Ennegrecer el círculo correspondiente
    }

    if (this.enteredPin.length === 4) {
      this.submitPin(); // Intentar enviar el PIN una vez que se ingresan 4 dígitos
      this.clearPin();
    }
  }

  clearPin() {
    this.enteredPin = '';
    this.pinDots.fill(false); // Restablecer los círculos
  }

  async submitPin() {
    const isValid = await this.pinService.validatePin(this.enteredPin);
    if (isValid) {
      this.router.navigateByUrl('/inicio');
    } else {
      const alert = await this.alertController.create({
        header: 'Codigo Incorrecto',
        message: 'Porfavor Intentalo Denuevo.',
        buttons: ['OK'],
      });
      await alert.present();
      this.clearPin(); // Restablecer el PIN en caso de que sea inválido
    }
  }
}