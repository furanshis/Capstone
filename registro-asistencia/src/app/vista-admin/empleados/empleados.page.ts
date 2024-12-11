import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.page.html',
  styleUrls: ['./empleados.page.scss'],
})
export class EmpleadosPage implements OnInit {
  empleados: any[] = []; // Aquí se almacenarán los empleados

  constructor(private firestore: AngularFirestore) {}

  ngOnInit() {
    this.cargarEmpleados();
  }

  cargarEmpleados(): void {
    // Obtener todos los documentos de la colección 'empleados'
    this.firestore.collection('empleado').snapshotChanges().subscribe(actions => {
      this.empleados = actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data }; // Devolvemos los datos del empleado junto con su ID
      });
    });
  }

  editarEmpleado(id: string): void {
    // Lógica para editar el empleado (puedes redirigir a otro formulario de edición)
    console.log("Editar empleado con ID:", id);
  }
  
  eliminarEmpleado(id: string): void {
    // Eliminar el empleado de la base de datos
    this.firestore.collection('empleados').doc(id).delete().then(() => {
      console.log("Empleado eliminado");
    }).catch(error => {
      console.error("Error al eliminar el empleado: ", error);
    });
  }

}
