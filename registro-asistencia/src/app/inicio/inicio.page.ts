import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AsistenciaserviceService } from '../services/asistenciaservice.service';

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
  pin: string = "1312";
  private timeInterval: any;
  userName: string = 'Usuario';

  // TODO: Replace with actual Firebase UID
  private currentUserid = 4;
  currentUserUid: string = "0ofEtCqRcgY7lOx78RzouYfBCyh2"


  images=[
    '/assets/imginicio/navegacion-gps-establece-iconos_24877-51664.jpg',
    '/assets/imginicio/png-transparent-time-and-attendance-computer-icons-time-attendance-clocks-computer-software-access-control-time-and-attendance-text-trademark-computer.png',
    '/assets/imginicio/R.jpeg',
    '/assets/imginicio/servicio-eficiente-logistica-entrega-exhibido-almacen-cajas-despertador_209190-272449.jpg'
  ]

  empleado = ""


  fecha: string;
  hora: string;

  constructor(
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

  // Método para validar la autenticación biométrica
  async authenticateAndRegisterAttendance() {
    try {
      this.isLoading = true;

      const result = await this.fingerprintAIO.show({
        title: 'Autenticación',
        description: 'Por favor, valide su identidad',
        fallbackButtonTitle: 'Usar PIN',
        disableBackup: false, // permitir el uso de PIN si la biometría falla
      });

      // Si la autenticación biométrica es exitosa, registrar la asistencia
      if (result && result.withFingerprint) {
        this.registerAttendance(); // Llama a la función de registrar la asistencia
      } else {
        this.errorMessage = 'Autenticación fallida. Intenta nuevamente.';
      }
    } catch (error) {
      console.error('Error de autenticación biométrica', error);
      // Maneja el error (por ejemplo, si la biometría no está disponible o es rechazada)
    }finally {
      this.isLoading = false;
    }
  }


  async registerAttendance() {
    
    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    //validar pin
    this.asistenciaService.validarPin('0ofEtCqRcgY7lOx78RzouYfBCyh2', '1311').subscribe({ 
      next: async (esValido) => {


        if (esValido === true) {
          const resultado = await this.asistenciaService.verificarAsistencia(this.currentUserUid).toPromise();  
          if (resultado) {
            console.log(resultado)
            this.isLoading = false;
            this.errorMessage = 'Ya tienes una asistencia registrada para hoy';
          }
          else {
            this.asistenciaService.createAttendance(this.currentUserid).subscribe( async (response) => {
              this.isLoading = false;
              this.successMessage = `Asistencia registrada exitosamente a las ${response.hora_entrada}`;
            },
            async (error) => {
              this.isLoading = false;
              this.errorMessage = 'Error al registrar la asistencia. Por favor intente nuevamente.';
              console.error('Error registering attendance:', error);
            }
          );

          }
          
        } else {
          this.isLoading = false;
          this.errorMessage = `El pin ingresado no es correcto, por favor ingrese su pin`;
          console.log('error')
        }
      },
      error: () => {
        this.successMessage = 'Error al validar el PIN';
      },
      
      
    })

    
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
    
  }

  // Método para cerrar sesión
  async logout() {
    await this.afAuth.signOut();
    localStorage.removeItem('Empleados'); // Limpiar el localStorage
    this.router.navigate(['/home']); // Redirigir al login
  }

 
};
