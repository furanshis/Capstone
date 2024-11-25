import { Component, OnDestroy, OnInit } from '@angular/core'
import { AlertController, LoadingController, ToastController } from '@ionic/angular';;
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AsistenciaserviceService } from '../services/asistenciaservice.service';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {
  isLoading = false;
  successMessage = '';
  errorMessage = '';
  currentTime = new Date();
  pin: string = "1234";
  private timeInterval: any;
  userName: string = 'Usuario';

  
 // Coordenadas del recinto de trabajo
 workplaceCoords = {
  lat: -33.060258, // Reemplaza con la latitud real
  lng: -71.449084  // Reemplaza con la longitud real
};
toleranceRadius = 3000; // Radio de 1 km en metros

  // TODO: Replace with actual Firebase UID
  private currentUserid = 4;
  uid: string = '';

  images=[
    '/assets/imginicio/navegacion-gps-establece-iconos_24877-51664.jpg',
    '/assets/imginicio/png-transparent-time-and-attendance-computer-icons-time-attendance-clocks-computer-software-access-control-time-and-attendance-text-trademark-computer.png',
    '/assets/imginicio/R.jpeg',
    '/assets/imginicio/servicio-eficiente-logistica-entrega-exhibido-almacen-cajas-despertador_209190-272449.jpg'
  ]

  empleado = "";

  message: string | null = null;


  fecha: string;
  hora: string;

  constructor(

    private toastCtrl: ToastController,
    private alertController: AlertController,
    private loadingCtrl: LoadingController,
    private fingerprintAIO: FingerprintAIO,
    private asistenciaService: AsistenciaserviceService,
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router
  ) {
    this.timeInterval = setInterval(() => {
      this.currentTime = new Date();
    }, 1000);
    const now = new Date();
    this.fecha = this.getFormattedDate(now);
    this.hora = this.getFormattedTime(now);
  }


  ngOnDestroy() {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  }

  
  // Función para calcular la distancia usando la fórmula de Haversine
  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Radio de la Tierra en metros
    const φ1 = lat1 * (Math.PI / 180);
    const φ2 = lat2 * (Math.PI / 180);
    const Δφ = (lat2 - lat1) * (Math.PI / 180);
    const Δλ = (lon2 - lon1) * (Math.PI / 180);

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Retorna la distancia en metros
  }

  // Función para obtener la ubicación actual del usuario
  async getCurrentPosition(): Promise<{ lat: number; lng: number }> {
    try {
      const position = await Geolocation.getCurrentPosition();
      console.log('Accuracy:', position.coords.accuracy);

      return {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
    } catch (error) {
      console.error('Error obteniendo posición:', error);
      throw new Error('No se pudo obtener la ubicación actual.');
    }
  }

  // Función para verificar si el usuario está dentro del área permitida
  async checkLocation(): Promise<boolean>  {
    try {
      const userCoords = await this.getCurrentPosition();
      const distance = this.calculateDistance(
        userCoords.lat,
        userCoords.lng,
        this.workplaceCoords.lat,
        this.workplaceCoords.lng
      );

      if (distance <= this.toleranceRadius) {
        this.message = 'Estás dentro del área permitida. Puedes registrar tu asistencia.';
        return true;
      } else {
        this.message = 'Estás fuera del área permitida. No puedes registrar tu asistencia.';
        return false;
      }
    } catch (error) {
      this.message = 'Error al obtener tu ubicación. Verifica los permisos de geolocalización.';
      console.error('Error:', error);
      return false;
    }
  }

  

  onNumberClick(number: number): void {
    if (this.pin.length < 4) {
      this.pin += number.toString();
    }
  }

  onDelete(): void {
    this.pin = this.pin.slice(0, -1);
  }

  onClear(): void {
    this.pin = '';
  }

  async checkFingerprint(): Promise<boolean> {
    try {
      const isBiometryAvailable = await this.fingerprintAIO.isAvailable();
      if (!isBiometryAvailable) {
        await this.showToast('Autenticación biométrica no disponible en este dispositivo.', 'warning');
        return false;
      }

      await this.fingerprintAIO.show({
        title: 'Verificación de Huella Digital',
        subtitle: 'Coloque su huella digital para registrar asistencia',
        description: 'Por favor autentique su identidad',
        disableBackup: true, // Se desactiva la opción de PIN
      });

      return true;
    } catch (error) {
      console.error('Error en la autenticación biométrica:', error);
      await this.showToast('Error en la autenticación biométrica.', 'danger');
      return false;
    }
  }

  async registerAttendance(): Promise<void> {
    const fingerprintValid = await this.checkFingerprint();
    if (!fingerprintValid) {
      return;
    }

    if (!this.uid) {
      await this.showToast('Error: Usuario no identificado.', 'danger');
      return;
    }

    // Verificar geolocalización
    const isInAllowedArea = await this.checkLocation();
    if (!isInAllowedArea) {
      this.errorMessage = 'No puedes registrar asistencia fuera del área permitida.';
      this.isLoading = false;
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Registrando asistencia...',
      spinner: 'circular',
    });
    await loading.present();

    try {
      const resultado = await this.asistenciaService.verificarAsistencia(this.uid).toPromise();
      console.log('Resultado:', resultado);
      if (resultado === "true") {
        this.errorMessage = 'Ya tienes una asistencia registrada para hoy.';
        await this.showToast(this.errorMessage, 'warning');
      } else if (resultado === "false") {
        this.asistenciaService.createAttendance(this.uid).subscribe(
          async (response) => {
            this.successMessage = `Asistencia registrada exitosamente a las ${response.hora_entrada}`;
            await this.showToast(this.successMessage, 'success');
          },
          async () => {
            this.errorMessage = 'Error al registrar la asistencia. Por favor intente nuevamente.';
            await this.showToast(this.errorMessage, 'danger');
          }
        );
      }
    } catch (error) {
      this.errorMessage = 'Error al validar la asistencia. Inténtelo de nuevo.';
      console.error(error);
      await this.showToast(this.errorMessage, 'danger');
    } finally {
      await loading.dismiss();
    }
  }
  


  private async showToast(message: string, color: string): Promise<void> {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      color,
      position: 'top'
    });
    await toast.present();
  }




  getFormattedDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return date.toLocaleDateString('es-ES', options); // Cambia 'es-ES' según tu preferencia de localización
  }

  getFormattedTime(date: Date): string {
    const options: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' };
    return date.toLocaleTimeString('es-ES', options); // Cambia 'es-ES' según tu preferencia de localización
  }


  swiperSlideChanged(e: any){
    console.log('changed: ',e);
  }


  async ngOnInit(){  
    // Obtener el nombre del usuario desde Firebase Authentication
    const user = await this.afAuth.currentUser;
    if (user) {
      this.userName = user.displayName || 'Usuario';
    }
    this.empleado = localStorage.getItem('Empleados')!;

    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.uid = user.uid; // UID del usuario autenticado
        this.userName = user.displayName || 'Empleado'; // Opcional: nombre del usuario
        console.log('UID:', this.uid);
      } else {
        // Manejo en caso de que no haya usuario autenticado
        this.uid = '';
      }
    });
    
  }

  // Método para cerrar sesión
  async logout() {
    await this.afAuth.signOut();
    localStorage.removeItem('Empleados'); // Limpiar el localStorage
    this.router.navigate(['/home']); // Redirigir al login
  }

 
};
