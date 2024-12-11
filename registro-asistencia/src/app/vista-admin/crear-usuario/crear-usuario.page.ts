import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ToastController } from '@ionic/angular';
import { EmpleadoService } from '../../services/empleado.service';

@Component({
  selector: 'app-crear-usuario',
  templateUrl: './crear-usuario.page.html',
  styleUrls: ['./crear-usuario.page.scss'],
})
export class CrearUsuarioPage  {
  


  email: string = '';
  password: string = '';
  primer_nombre: string = '';
  segundo_nombre: string = '';
  apellido_paterno: string = '';
  apellido_materno: string = '';
  horario_entrada_real: string = '';
  horario_salida_real: string = '';
  pinpass: number = 1234;
  goBack(){
    window.history.back();
  }


  constructor(
    private toastCtrl: ToastController,

    private auth: AngularFireAuth,
    private firestore: AngularFirestore,
    private toastController: ToastController,
    private empleadoService: EmpleadoService
  ) {}

  async crearEmpleado() {
    if (!this.email.endsWith('@duocuc.cl')) {
      this.showToast('El correo debe ser del dominio @duocuc.cl', 'danger');
      console.error('El correo debe ser del dominio @duocuc.cl');
      return;
    }
    try {
      const userCredential = await this.auth.createUserWithEmailAndPassword(
        this.email,
        this.password
      );

      const user = userCredential.user;

      if (user){
        const displayName = `${this.primer_nombre} ${this.apellido_paterno}`;
        await user.updateProfile({ displayName: displayName });
      }

      const uid = userCredential.user?.uid;
      if (uid) {
        

        
        await this.firestore.collection('empleado').doc(uid).set({
          primer_nombre: this.primer_nombre,
          segundo_nombre: this.segundo_nombre,
          apellido_paterno: this.apellido_paterno,
          apellido_materno: this.apellido_materno,
          horario_entrada_real: this.horario_entrada_real,
          horario_salida_real: this.horario_salida_real,
          pinpass: this.pinpass,
          email: this.email,
        });
        this.showToast('Empleado creado correctamente.', 'success');
        console.log('Empleado creado correctamente.');
      }
    } catch (error) {
      this.showToast('error creando usuario', 'danger');
      console.error('Error creando empleado:', error);
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
