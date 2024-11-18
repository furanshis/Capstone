import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ToastController } from '@ionic/angular';
import { EmpleadoService } from '../services/empleado.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage {

  email: string = '';
  password: string = '';
  firstName: string = '';
  secondName: string = '';
  lastName: string = '';
  secondLastName: string = '';
  horario_entrada_real: string = '';
  horario_salida_real: string = '';
  goBack(){
    window.history.back();
  }


  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private toastController: ToastController,
    private empleadoService: EmpleadoService
  ) {}

  async addEmployee(): Promise<any> {  
    try {
      // Crear usuario en Firebase Authentication
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(this.email, this.password);
      const uid = userCredential.user?.uid;

      if (uid) {
        
        const empleado = {
          uid_empleado: uid,
          primero_nombre: this.firstName,
          segundo_nombre: this.secondName,
          apellido_paterno: this.lastName,
          apellido_materno: this.secondLastName,
          horario_entrada_real: this.horario_entrada_real,
          horario_salida_real: this.horario_salida_real,
        }
        try {
          await this.empleadoService.crearEmpleado(empleado)
        } catch (error) {
          console.error('Error al agregar empleado:', error);
          return error
        }

        // Mostrar notificación de éxito
        const toast = await this.toastController.create({
          message: 'Empleado agregado exitosamente',
          duration: 2000,
          color: 'success'
        });
        toast.present();
        
        // Limpiar el formulario
        this.email = '';
        this.password = '';
        this.firstName = '';
        this.secondName = ''; 
        this.lastName = '';
        this.secondLastName = '';
        this.horario_entrada_real = '';
        this.horario_salida_real = '';
      }
    } catch (error) {
      console.error('Error al agregar empleado:', error);
      const toast = await this.toastController.create({
        message: 'Error al agregar empleado',
        duration: 2000,
        color: 'danger'
      });
      toast.present();
    }
  }
}

