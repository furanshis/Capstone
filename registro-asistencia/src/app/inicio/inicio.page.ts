import { Component, OnDestroy, OnInit } from '@angular/core'
import { AlertController, LoadingController, ToastController } from '@ionic/angular';;
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AsistenciaserviceService } from '../services/asistenciaservice.service';
import { Geolocation } from '@capacitor/geolocation';
import { Asistencia2 } from '../interfaces/models';
import { Observable } from 'rxjs';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { Firestore, collection, query, where, getDocs } from '@angular/fire/firestore';

interface EmpresaData {
  latitud: number;
  longitud: number;
}

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {
  
  isLoading = false;
  successMessage = '';
  errorMessage = '';
  succesMessageSalida= '';
  errorMessageSalida = '';
  currentTime = new Date();
  pinpass: number = 1234 ;
  private timeInterval: any;
  userName: string = 'Usuario';
  userLatitude: number = 0;
  userLongitude: number = 0;
  asistenciaHoy: Asistencia2 | null = null;
  fechaHoy: string = new Date().toISOString().split('T')[0];
  registroAsistencia = false
  enteredPin: number = 1234; // PIN ingresado por el usuario
  storedPin: number =  1234;  // PIN almacenado en Firestore
  type: string = '';

  //cASA JUAN
 // Coordenadas del recinto de trabajo
// workplaceCoords = {
//  lat: -33.060258, // Reemplaza con la latitud real
//  lng: -71.449084  // Reemplaza con la longitud real
//};
//toleranceRadius = 5000; // Radio de 5 km en metros

//DUOC 33.0337° S, 71.5332° W
workplaceCoords = {
lat: 0, // Reemplaza con la latitud real
lng: 0  // Reemplaza con la longitud real
};
toleranceRadius = 1000; // Radio de 1 km en metros

  // TODO: Replace with actual Firebase UID
  
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
        this.message = 'Estás dentro del área permitida. Puedes registrar tu asistencia.';
        console.log('Estás dentro del área permitida. Puedes registrar tu asistencia.');
        return true;
      } else {
        this.message = 'Estás fuera del área permitida. No puedes registrar tu asistencia.';
        console.log('Estás fuera del área permitida. No puedes registrar tu asistencia.');
        return false;
      }
    } catch (error) {
      this.message = 'Error al obtener tu ubicación. Verifica los permisos de geolocalización.';
      console.error('Error:', error);
      return false;
    }
  }

  async obtenerCoordenadasEmpresa(uid: string) {
    try {
      const empresaRef = this.firestore.collection('empresas', ref => ref.where('uid_empleado', '==', uid));
      const snapshot = await empresaRef.get().toPromise();
      if (snapshot && !snapshot.empty) {
        const empresaData = snapshot.docs[0].data() as EmpresaData;
        console.log('Coordenadas de la empresa:', empresaData);
        this.workplaceCoords.lat = empresaData?.latitud;
        this.workplaceCoords.lng = empresaData?.longitud;
      } else {
        this.showToast('Empresa no encontrada para el empleado.', 'danger');
      }
    } catch (error) {
      console.error('Error al obtener coordenadas de empresa:', error);
    }
  }

  

  // Verificar si el usuario tiene una asistencia registrada para hoy
  async checkAsistenciaHoy() {
    const tieneAsistencia = await this.asistenciaService.verificarAsistenciaHoy(this.uid);
  
    if (tieneAsistencia) {
      console.log('Ya existe una asistencia para hoy.');
      return true
    } else {
      console.log('No hay asistencia registrada para hoy.');
      return false
      
    }
    }

  

  //ve las dos opciones de autenticación biétrica y huella dactilar
  async checkFingerprint(): Promise<boolean> {
    try {
      const isBiometryAvailable = await this.fingerprintAIO.isAvailable();
      if (!isBiometryAvailable) {
        await this.showToast('Biometría no disponible. Usando PIN del dispositivo.', 'warning');
        // Si no hay biometría, se utiliza el PIN de bloqueo del teléfono
        const result = await this.fingerprintAIO.show({
          title: 'Verificación de Huella Digital',
          subtitle: 'Coloque su huella digital para continuar',
          description: 'Por favor autentique su identidad.',
          disableBackup: false, // Permite usar el PIN si no se reconoce la huella
        });
        
        if (result) {
          // Si la autenticación fue exitosa
          return true;
        } else {
          // Si el usuario cancela o no se autentica
          await this.showToast('Autenticación fallida o cancelada.', 'danger');
          return false;
        }
      } else {
        await this.showToast('Autenticación biométrica disponible. Usando huella dactilar.', 'success');
        // Si hay biometría, se usa la huella dactilar
        const result = await this.fingerprintAIO.show({
          title: 'Verificación de Huella Digital',
          subtitle: 'Coloque su huella digital para continuar',
          description: 'Por favor autentique su identidad.',
          disableBackup: false, // Permite usar el PIN si no se reconoce la huella
        });
  
        if (result) {
          // Si la autenticación fue exitosa
          return true;
        } else {
          // Si el usuario cancela o no se autentica
          await this.showToast('Autenticación fallida o cancelada.', 'danger');
          return false;
        }
      }
    } catch (error) {
      console.error('Error en la autenticación biométrica:', error);
      await this.showToast('Error en la autenticación. Intente de nuevo.', 'danger');
      return false;
    }
  }


  
  
  
  
  
  
  
  
  
  
  
  


   // Función para registrar la asistencia (entrada o salida)
   probarAsistencia() {
    if (this.asistenciaHoy) {
      // Si ya tiene una asistencia, registrar salida
      this.registerSalida();
    } else {
      // Si no tiene asistencia, registrar entrada
      this.registrarAsistencia();
    }
  }

  

  async registrarAsistencia() {
    /*
    const fingerprintValid = await this.checkFingerprint();
    if (!fingerprintValid) {
      return;
    }

    if (!this.uid) {
      await this.showToast('Error: Usuario no identificado.', 'danger');
      return;
    }
    */
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

    
      // Si no tiene asistencia, registrar entrada
      try {
        const nueva_asistencia: Asistencia2 = {
          uid: this.uid, // Reemplaza con el UID del empleado
          fechaCreacion: new Date(),
          horaEntrada: new Date().toLocaleTimeString(),
          validacionBiometrica: true,
          horaSalida: '',
          horasTrabajadas: 0,
          horasExtras: 0,
          latitud: this.userLatitude, // Reemplaza con la latitud actual
          longitud: this.userLongitude, // Reemplaza con la longitud actual
        
        }
  
        this.asistenciaService.crearAsistencia(nueva_asistencia)
        .then(() => this.successMessage = 'Asistencia registrada con éxito!')
        .catch((error) => this.errorMessage = 'Hubo un error al registrar la entrada.');
        
  
  
      } catch (error) {
        this.errorMessage = 'Error al validar la asistencia. Inténtelo de nuevo.';
        console.error(error);
        await this.showToast(this.errorMessage, 'danger');
      } finally {
        await loading.dismiss();
      }
    
  }


  // Registrar la salida
  async registerSalida() {
    
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
      this.errorMessage = 'No puedes marcar salida fuera del área permitida.';
      this.isLoading = false;
      return;
    }
    
    

    this.isLoading = true;
    try {
      

      // Actualizar la asistencia con la hora de salida
      await this.asistenciaService.actualizarAsistencia(this.uid);
      this.succesMessageSalida = 'Salida registrada con éxito!';
    } catch (error) {
      console.error('Error al registrar la salida:', error);
      this.errorMessageSalida = 'Hubo un error al registrar la salida.';
    } finally {
      this.isLoading = false;
    }
  }

  // Calcular las horas trabajadas entre la hora de entrada y salida
  calcularHorasTrabajadas(entrada: Date): number {
    const salida = new Date();
    const diferencia = salida.getTime() - entrada.getTime(); // Diferencia en milisegundos
    return diferencia / (1000 * 60 * 60); // Convertir de milisegundos a horas
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
  }

  async validatePinAndRegister() {
    // Verificar geolocalización
    const isInAllowedArea = await this.checkLocation();
    if (!isInAllowedArea) {
      this.errorMessage = 'No puedes registrar asistencia fuera del área permitida.';
      this.isLoading = false;
      return;
    }
  
    // Crear un loading spinner mientras se procesa
    const loading = await this.loadingCtrl.create({
      message: 'Registrando asistencia...',
      spinner: 'circular',
    });
    await loading.present();
  
    try {
      // Asegúrate de que 'this.uid' tiene el valor correcto
      if (!this.uid) {
        this.errorMessage = 'No se encontró el UID del usuario.';
        return;
      }
  
      // Obtener el PIN almacenado en Firestore
      const pinpassSnapshot = await this.firestore
        .collection('empleados')
        .doc(this.uid)  // Usamos el UID para acceder al documento
        .get()
        .toPromise(); // Convertimos el observable en una promesa
  
      if (pinpassSnapshot && pinpassSnapshot.exists) {
        const storedPin = (pinpassSnapshot.data() as { pinpass: number })?.pinpass;
        console.log('PIN almacenado:', storedPin);
        console.log('PIN ingresado:', this.enteredPin);
  
        // Comparar los valores de forma correcta
        if (storedPin === this.enteredPin) {
          console.log('PIN correcto, registrando asistencia...');
          
          // Crear el objeto de asistencia para almacenar en Firestore
          const asistencia: Asistencia2 = {
            uid: this.uid,
            fechaCreacion: new Date(),
            horaEntrada: new Date().toLocaleTimeString(),
            horaSalida: '',  // Este campo puede quedar vacío por ahora
            horasTrabajadas: 0, // Puedes calcular las horas trabajadas más tarde
            validacionBiometrica: false, // Si es necesario, puedes usar la validación biométrica
            horasExtras: 0, // Puedes calcular las horas extras si es necesario
            latitud: this.workplaceCoords.lat,
            longitud: this.workplaceCoords.lng,
          };
  
          // Guardar la asistencia en la colección de Firestore
          await this.firestore.collection('asistencias').add(asistencia);
  
          console.log('Asistencia registrada correctamente.');
          // Aquí puedes añadir más lógica si es necesario, como cambiar el estado o actualizar la UI
        } else {
          this.errorMessage = 'El PIN ingresado es incorrecto.';
        }
      } else {
        this.errorMessage = 'No se encontró el PIN del usuario en la base de datos.';
      }
    } catch (error) {
      this.errorMessage = 'Hubo un error al validar el PIN.';
      console.error(error);
    } finally {
      await loading.dismiss();
    }
  }
  
  

  // Método para cerrar sesión
  async logout() {
    await this.afAuth.signOut();
    localStorage.removeItem('Empleados'); // Limpiar el localStorage
    this.router.navigate(['/home']); // Redirigir al login
  }

  




 
};
function validatePinAndRegister() {
  throw new Error('Function not implemented.');
}

