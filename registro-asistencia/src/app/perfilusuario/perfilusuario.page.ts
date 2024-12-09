import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Firestore, doc, getDoc} from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfilusuario',
  templateUrl: './perfilusuario.page.html',
  styleUrls: ['./perfilusuario.page.scss'],
})
export class PerfilusuarioPage implements OnInit {

  userName = '';
  uid = ''

  nombreEmpresa: string = '';
  horarioEntrada: string = '';
  horarioSalida: string = '';

  uidEmpleado: string = '';

  goBack() {
    this.router.navigate(['/inicio']);
  }

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: Firestore, 
    private router: Router
  ) { }

  async ngOnInit() {
    const user = await this.afAuth.currentUser;
    if (user) {
      this.userName = user.displayName || 'Usuario';
    }
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.uid = user.uid; // UID del usuario autenticado
        this.userName = user.displayName || 'Empleado'; // Opcional: nombre del usuario
        console.log('UID:', this.uid);

   
      } else {
        // Manejo en caso de que no haya usuario autenticado
        this.uid = '';
      }
    });
  }

  async cargarDatosEmpleado() {
    try {
      const docRef = doc(this.firestore, `empleados/${this.uidEmpleado}`);
      const empleadoSnap = await getDoc(docRef);

      if (empleadoSnap.exists()) {
        const data = empleadoSnap.data();

        // Asignar datos al modelo
        this.horarioEntrada = data['horario_entrada_real'] || '';
        this.horarioSalida = data['horario_salida_real'] || '';
      } else {
        console.error('No se encontraron datos del empleado.');
      }
    } catch (error) {
      console.error('Error al cargar los datos:', error);
    }
  }
  

}
