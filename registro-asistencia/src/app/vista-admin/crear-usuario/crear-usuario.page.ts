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
  supervisor: number = 0;
  departamento: number = 0;
  pin: number = 1234;
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
          primer_nombre: this.primer_nombre,
          segundo_nombre: this.segundo_nombre,
          apellido_paterno: this.apellido_paterno,
          apellido_materno: this.apellido_materno,
          horario_entrada_real: this.horario_entrada_real,
          horario_salida_real: this.horario_salida_real,
          supervisor: this.supervisor,
          departamento: this.departamento,
          pin: this.pin,
        }
        console.log(empleado.horario_entrada_real)
        
        await this.empleadoService.crearEmpleado(empleado).toPromise();
        console.log()

        await this.afAuth.signOut();
        

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
        this.primer_nombre = '';
        this.segundo_nombre = ''; 
        this.apellido_paterno = '';
        this.apellido_materno = '';
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
