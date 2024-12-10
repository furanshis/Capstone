import { Component, OnDestroy, OnInit } from '@angular/core'
import { AlertController, LoadingController, ToastController } from '@ionic/angular';;
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AsistenciaserviceService } from '../services/asistenciaservice.service';
import { Geolocation } from '@capacitor/geolocation';
import { Asistencia2, Empleado } from '../interfaces/models';
import { first, Observable } from 'rxjs';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { Firestore, collection, query, where, getDocs } from '@angular/fire/firestore';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-pin-salida',
  templateUrl: './pin-salida.page.html',
  styleUrls: ['./pin-salida.page.scss'],
})
export class PinSalidaPage implements OnInit {

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

  async registerSalida() {
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
            // Actualizar la asistencia con la hora de salida
            await this.asistenciaService.actualizarAsistencia(this.uid);
            await this.showToast('Salida registrada con éxito!', 'success');
            this.router.navigate(['/inicio']);
          } catch (locationError) {
            this.showToast('error, vuelva a intentarlo', 'danger');
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

  

  


  async ngOnInit() {

    const user = await this.afAuth.currentUser;

    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.uid = user.uid; // UID del usuario autenticado
        this.userName = user.displayName || 'Empleado'; // Opcional: nombre del usuario
        console.log('UID:', this.uid);

        

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
        this.registerSalida();  // Verificar el PIN y registrar asistencia
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
