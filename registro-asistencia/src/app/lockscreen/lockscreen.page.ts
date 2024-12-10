import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { doc, getDoc } from 'firebase/firestore';
import { first } from 'rxjs/operators';
import { Asistencia2, Empleado } from '../interfaces/models';
import { LoadingController } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';
import { firstValueFrom } from 'rxjs';
import { AsistenciaserviceService } from '../services/asistenciaservice.service';










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
  navCtrl: any;
  uid: string = '';
  errorMessage: string ='';
  geoLocationService: any;
  userLatitude: number = 0;

  isLoading = false;
  horasTrabajadas = '';
  successMessage = '';
  succesMessageSalida= '';
  errorMessageSalida = '';
  currentTime = new Date();
  userName: string = 'Usuario';
  userLongitude: number = 0;
  asistenciaHoy: Asistencia2 | null = null;
  fechaHoy: string = new Date().toISOString().split('T')[0];
  registroAsistencia = false
  type: string = '';

  workplaceCoords = {
    lat: 0, // Reemplaza con la latitud real
    lng: 0  // Reemplaza con la longitud real
    };
    toleranceRadius = 5000; // Radio de 1 km en metros
  


  goBack() {
    window.history.back();
  }

  constructor(
    private toastCtrl: ToastController,

    private router: Router,
    private alertController: AlertController,
    private firestore: AngularFirestore,
    private toastController: ToastController,
    private loadingCtrl: LoadingController,
    private afAuth: AngularFireAuth,
    private asistenciaService: AsistenciaserviceService,


  ) {}

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

  formatearHoras(horas: number): string {
    const horasEnteras = Math.floor(horas);
    const minutos = Math.round((horas - horasEnteras) * 60);
    return `${horasEnteras}h ${minutos}m`;
  }

  async cargarHorasTrabajadas(uid: string) {
    try {
  
      console.log('Consultando reporte para UID:', uid);
  
      const reporte = await firstValueFrom(
        this.asistenciaService.getReporteAsistencia(uid)
      );
  
      console.log('Datos recibidos:', reporte);
  
      if (reporte && reporte.horas_totales_trabajadas !== undefined) {
        console.log('se encontraron datos')
        this.horasTrabajadas = this.formatearHoras(reporte.horas_totales_trabajadas);
      } else {
        console.log('No se encontró el reporte para este UID.');
        this.horasTrabajadas = '0h 0m';
      }
    } catch (error) {
      console.log('Error al cargar el reporte:', error);
      this.horasTrabajadas = 'Error al cargar datos';
    }
  }

  


  async ngOnInit() {

    const user = await this.afAuth.currentUser;

    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.uid = user.uid; // UID del usuario autenticado
        this.userName = user.displayName || 'Empleado'; // Opcional: nombre del usuario
        console.log('UID:', this.uid);

        //obtener registro
        this.cargarHorasTrabajadas(this.uid);

        // Obtener coordenadas de la empresa
        this.firestore
          .collection('Empresa', (ref) => ref.where('uid_empleado', '==', this.uid))
          .valueChanges()
          .subscribe(
            (empresas: any[]) => {
              if (empresas.length > 0) {
                const empresa = empresas[0];
                this.workplaceCoords.lat = empresa.latitud;
                this.workplaceCoords.lng = empresa.longitud;

                console.log("latitud", this.workplaceCoords.lat);
                console.log("longitud", this.workplaceCoords.lng);  
              } else {
                console.error('Empresa no encontrada');
              }
            },
            (error) => {
              console.error('Error al obtener datos de la empresa:', error);
            }
          );
      } else {
        // Manejo en caso de que no haya usuario autenticado
        this.uid = '';
      }
    });



    const uid = localStorage.getItem('uid'); // Obtiene el UID del usuario
    if (uid) {
      try {
        const empleadoDoc = await this.firestore.collection('empleados').doc(uid).get().toPromise();
        if (empleadoDoc && empleadoDoc.exists) {
          const empleadoData = empleadoDoc.data() as Empleado;
          this.pinpass = empleadoData.pinpass; // Accede a `pinpass`
        } else {
          await this.showToast('Error: Usuario no encontrado.', 'danger');
        }
      } catch (error) {
        console.error('Error al obtener el documento:', error);
        await this.showToast('Error al cargar los datos del usuario.', 'danger');
      }
    }
  }




  // Método para validar el PIN y registrar la asistencia

  // Método para validar el PIN y registrar la asistencia
async validatePinAndRegister() {
  try {
    // Asegurarse de que el UID esté disponible usando AngularFireAuth
    const empleado = await this.afAuth.authState.pipe(first()).toPromise();

    if (empleado) {
      this.uid = empleado.uid; // Asignamos UID solo si el usuario está autenticado
    } else {
      this.showToast('Error: Usuario no identificado.', 'danger');
      this.errorMessage = 'No se encontró el UID del usuario.';
      console.error('Error: UID del usuario no está definido.');
      return; // Salir si no hay usuario autenticado
    }

    const isInAllowedArea = await this.checkLocation();
    if (!isInAllowedArea) {
      await this.showToast('No puedes registrar asistencia fuera del área permitida.', 'danger');
      this.isLoading = false;
      return;
    }

    console.log(`Buscando empleado con UID: ${this.uid} en la colección empleados...`);

    // Consultamos la colección de empleados usando el UID
    const empleadoRef = this.firestore.collection('empleado', ref => ref.where('uid_empelado', '==', this.uid));
    const snapshot = await empleadoRef.get().toPromise();

    if (snapshot && !snapshot.empty) {
      const empleadoData = snapshot.docs[0].data() as Empleado; // Cast al tipo de empleado
      console.log('Datos del empleado:', empleadoData);

      // Verificar si el PIN ingresado coincide con el PIN almacenado en Firestore
      if (this.enteredPin === empleadoData.pinpass) {
        console.log('PIN correcto, registrando asistencia...');

        // Obtener la ubicación del empleado
        try {
          const location = await this.getCurrentPosition();
          console.log('Ubicación obtenida:', location);

          // Crear el objeto de asistencia
          const asistencia = {
            uid: this.uid, // Reemplaza con el UID del empleado
            fechaCreacion: new Date(),
            horaEntrada: new Date().toLocaleTimeString('en-GB', { hour12: false }),
            validacionBiometrica: false,
            horaSalida: '',
            horasTrabajadas: 0,
            horasExtras: 0,
            latitud: this.userLatitude, // Reemplaza con la latitud actual
            longitud: this.userLongitude, // Reemplaza con la longitud actual
          };

          // Guardar la asistencia en Firestore
          await this.registrarAsistencia(asistencia);
        } catch (locationError) {
          this.showToast('No se pudo obtener la geolocalización', 'danger');
          console.error('Error al obtener ubicación:', locationError);
          return;
        }
      } else {
        this.showToast('PIN incorrecto', 'danger');
        this.errorMessage = 'El PIN ingresado es incorrecto.';
        console.error('Error: El PIN ingresado no coincide con el almacenado.');
        return;
      }
    } else {
      this.errorMessage = 'No se encontró el empleado en la base de datos.';
      console.error('Error: Documento del empleado no encontrado en la base de datos.');
    }
  } catch (error) {
    this.errorMessage = 'Hubo un error al validar el PIN.';
    console.error('Error al validar el PIN:', error);
  } finally {
    console.log('Finalizando proceso de validación...');
    await this.loadingCtrl.dismiss();
  }
}

  
  // Método para registrar la asistencia con ubicación
  async registrarAsistencia(asistencia: any) {
    try {
      // Guardamos la entrada en Firestore en la colección 'asistencia'
      await this.firestore.collection('asistencia').add(asistencia);  // Guardamos en la colección 'asistencia'
    
      this.showToast('Asistencia registrada con éxito', 'success');
      this.router.navigate(['/inicio']); // Redirigimos al usuario a la página principal
    } catch (error) {
      console.error('Error al registrar la asistencia:', error);
      this.showToast('Hubo un error al registrar la asistencia', 'danger');
    }
  }
  

  // Agregar número al PIN ingresado
  addNumber(number: string) {
    if (this.enteredPin.length < 4) {
      this.enteredPin += number;
      this.pinDots[this.enteredPin.length - 1] = true;

      // Al completar el PIN de 4 dígitos, se valida el PIN y registra la asistencia
      if (this.enteredPin.length === 4) {
        this.validatePinAndRegister();  // Verificar el PIN y registrar asistencia
      }
    }
  }

  clearPin() {
    this.enteredPin = '';
    this.pinDots.fill(false); // Restablecer los círculos
  }





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

  async checkLocation(): Promise<boolean>  {
    try {
      const userCoords = await this.getCurrentPosition();
      console.log('User coordinates:', userCoords);
      this.userLatitude = userCoords.lat;
      this.userLongitude = userCoords.lng;
      const distance = this.calculateDistance(
        userCoords.lat,
        userCoords.lng,
        this.workplaceCoords.lat,
        this.workplaceCoords.lng
      );

      if (distance <= this.toleranceRadius) {
        console.log('Estás dentro del área permitida. Puedes registrar tu asistencia.');
        return true;
      } else {
        console.log('Estás fuera del área permitida. No puedes registrar tu asistencia.');
        return false;
      }
    } catch (error) {
      console.error('Error:', error);
      return false;
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



}

