import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AlertController } from '@ionic/angular';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx'; // Lector de huellas dactilares
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  userName: string = '';
  totalHorasTrabajadas: number = 0;

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private faio: FingerprintAIO, // Lector de huellas
    private alertController: AlertController,
    private router: Router
  ) {}

  // Cargar datos del usuario y las horas trabajadas
  async loadUserData() {
    const user = await this.afAuth.currentUser;
    if (user) {
      const userRef = this.firestore.collection('users').doc(user.uid);
      userRef.valueChanges().subscribe((userData: any) => {
        this.userName = userData?.nombre || 'Usuario';
        this.totalHorasTrabajadas = userData?.horasTrabajadas || 0;
      });
    }
  }

   // Registrar entrada/salida usando huella dactilar
   registrarAsistencia() {
    this.faio.show({
      clientId: 'Fingerprint-Demo',
      clientSecret: 'password', // Solo necesario para Android
      disableBackup: true, // Deshabilita métodos de respaldo como PIN
      localizedFallbackTitle: 'Usar PIN', // Solo en Android
      localizedReason: 'Autentica para marcar tu asistencia' // Razón de autenticación
    })
    .then((result: any) => {
      // Lógica para registrar asistencia en la base de datos
      this.showAlert('Éxito', 'Asistencia registrada correctamente.');
    })
    .catch((error: any) => {
      this.showAlert('Error', 'No se pudo registrar la asistencia.');
    });
  }

  // Ir a la página de estadísticas (en el futuro)
  irEstadisticas() {
    this.router.navigateByUrl('/estadisticas');
  }

  // Mostrar alerta
  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

}
