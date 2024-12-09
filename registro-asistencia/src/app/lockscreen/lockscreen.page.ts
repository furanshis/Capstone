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
  userLatitude: any;


  goBack() {
    window.history.back();
  }

  constructor(
    private router: Router,
    private alertController: AlertController,
    private firestore: AngularFirestore,
    private toastController: ToastController,
    private loadingCtrl: LoadingController,
    private afAuth: AngularFireAuth  // Inyectamos AngularFireAuth


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



  // Método para validar el PIN y registrar la asistencia

  async validatePinAndRegister() {
    try {
      // Asegurarse de que el UID esté disponible usando AngularFireAuth
      const user = await this.afAuth.authState.pipe(first()).toPromise(); // Usamos authState
      
      // Verificar explícitamente si 'user' es null o undefined
      if (user) {
        this.uid = user.uid; // Asignamos UID solo si 'user' no es null
      } else {
        this.errorMessage = 'No se encontró el UID del usuario.';
        console.error('Error: UID del usuario no está definido.');
        return; // Salir si no hay usuario autenticado
      }
  
      console.log(`Buscando empleado con UID: ${this.uid} en la colección empleados...`);
  
      // Consultamos la colección de empleados usando el UID del usuario
      const empleadoRef = this.firestore.collection('empleados', ref => ref.where('uid', '==', this.uid));
      const snapshot = await empleadoRef.get().toPromise();  // Convertimos el Observable en Promesa
  
      if (snapshot && !snapshot.empty) {
        const empleadoData = snapshot.docs[0].data() as Empleado;  // Casteamos el documento obtenido
        console.log('Datos del empleado:', empleadoData);
  
        // Verificar si el PIN ingresado coincide con el PIN almacenado en Firestore
        if (this.enteredPin === empleadoData.pinpass) {
          console.log('PIN correcto, registrando asistencia...');
          
          // Obtener la ubicación del empleado
          const location = await this.geoLocationService.getLocation();
          if (!location) {
            this.showToast('No se pudo obtener la geolocalización', 'danger');
            return;
          }
  
          // Crear el objeto de asistencia
          const asistencia = {
            fecha_asistencia: new Date().toISOString(),
            hora_entrada: new Date().toLocaleTimeString(),
            hora_salida: '',  // Se llenará más tarde cuando salga
            horas_trabajadas: 0,
            horas_extras: 0,
            geolocacion: {
              x: location.latitude,
              y: location.longitude
            },
            validacion_biometrica: false,
          };
  
          // Ahora guardamos la asistencia
          await this.registrarAsistencia(asistencia); // Pasamos el objeto de asistencia a la función
  
        } else {
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
      this.router.navigate(['/home']); // Redirigimos al usuario a la página principal
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

  async submitPin() {
    const isValid = await this.pinpass.includes(this.enteredPin);
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