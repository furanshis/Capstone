import { Component, OnInit } from '@angular/core';
import { Firestore, collection, query, where, getDocs } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-cambiar-pin',
  templateUrl: './cambiar-pin.page.html',
  styleUrls: ['./cambiar-pin.page.scss'],
})
export class CambiarPinPage implements OnInit {

  nuevoPin: string = '';
  confirmarPin: string = '';

  constructor(
    private firestore: AngularFirestore,
    private auth: AngularFireAuth,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
  }

  async cambiarPin() {
    if (this.nuevoPin !== this.confirmarPin) {
      this.mostrarToast('Los PIN no coinciden');
      return;
    }

    try {
      const user = await this.auth.currentUser;
      if (!user) {
        this.mostrarToast('Usuario no autenticado');
        return;
      }
      console.log('usuario', user);

      const uid = user.uid;
      console.log('UID del usuario:', uid);

      const empleadoRef = await this.firestore.collection('empleado', ref => ref.where('uid_empelado', '==', uid)).get().toPromise();
      
      if (!empleadoRef || empleadoRef.empty) {
        this.mostrarToast('Empleado no encontrado');
        return;
      }

      const empleadoDoc = empleadoRef.docs[0];

      await this.firestore.collection('empleado').doc(empleadoDoc.id).update({ pinpass: this.nuevoPin });

      

      this.mostrarToast('PIN actualizado correctamente');
      this.nuevoPin = '';
      this.confirmarPin = '';
    } catch (error) {
      console.error('Error al actualizar el PIN:', error);
      this.mostrarToast('Error al actualizar el PIN');
    }
  }

  async mostrarToast(mensaje: string) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 3000,
      position: 'bottom',
    });
    await toast.present();
  }


  goBack() {
    window.history.back();
  }

}
