import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ToastController } from '@ionic/angular';

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
  goBack(){
    window.history.back();
  }


  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private toastController: ToastController
  ) {}

  async addEmployee() {
    try {
      // Crear usuario en Firebase Authentication
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(this.email, this.password);
      const uid = userCredential.user?.uid;

      if (uid) {
        // Guardar datos adicionales en Firestore
        await this.firestore.collection('Empleados').doc(uid).set({
          correo: this.email,
          primer_nombre: this.firstName,
          segundo_nombre: this.secondName,
          apellido_paterno: this.lastName,
          apellido_materno: this.secondLastName,
          //role: 'employee',  // Rol por defecto como empleado
        });

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

