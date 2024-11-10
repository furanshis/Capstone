import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';



interface Employee {
  id: number;
  name: string;
  email: string;
  address: string;
  phone: string;
  correo: string;
  selected: boolean;

}

@Component({
  selector: 'app-manage-employees',
  templateUrl: 'manage-employees.page.html',
  styleUrls: ['manage-employees.page.scss'],
})
export class ManageEmployeesPage {
  selectAll: boolean = false;
  goBack(){
    window.history.back();
  }

  employees: Employee[] = [
    { id: 1, name: 'Thomas Hardy', email: 'thomashardy@mail.com', address: 'Chiaroscuro Rd, Portland, USA', phone: '(171) 555-2222',correo:'jua@gd.com' , selected: false },
    { id: 2, name: 'Dominique Perrier', email: 'dominiqueperrier@mail.com', address: 'Obere Str. 57, Berlin, Germany', phone: '(313) 555-5735',correo:'jua@gd.com' ,selected: false },
    { id: 3, name: 'Maria Anders', email: 'mariaanders@mail.com', address: '25, rue Lauriston, Paris, France', phone: '(503) 555-9931',correo:'jua@gd.com' , selected: false },
    { id: 4, name: 'Fran Wilson', email: 'franwilson@mail.com', address: 'C/ Araquil, 67, Madrid, Spain', phone: '(204) 619-5731',correo:'jua@gd.com' , selected: false },
    { id: 5, name: 'Martin Blank', email: 'martinblank@mail.com', address: 'Via Monte Bianco 34, Turin, Italy', phone: '(480) 631-2097',correo:'jua@gd.com' , selected: false }
  ];

  constructor(private router: Router, private toastController: ToastController,private alertController: AlertController) {}
//IS LOADING
  isLoading: boolean = false;

//TOASTCONTROLLER
async presentToast(message: string) {
  const toast = await this.toastController.create({
    message: message,
    duration: 2000,
    position: 'bottom',
  });
  toast.present();
}

async presentAlertConfirm() {
  const alert = await this.alertController.create({
    header: 'Confirmación',
    message: '¿Estás seguro de que quieres eliminar a los empleados seleccionados?',
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel',
        handler: () => { console.log('Acción cancelada'); }
      },
      {
        text: 'Eliminar',
        handler: () => { this.deleteSelected(); }
      }
    ]
  });

  await alert.present();
}


  // Marca o desmarca todos los empleados
  selectAllEmployees() {
    this.employees.forEach(employee => {
      employee.selected = this.selectAll;
    });
  }

  // Elimina los empleados seleccionados
  deleteSelected() {
    const confirmDelete = window.confirm('¿Estás seguro de que quieres eliminar a los empleados seleccionados?');
    if (confirmDelete) {
      this.employees = this.employees.filter(employee => !employee.selected);
    }
  }
  // logica borrar seleccion no se puede marcar si no hay ninguno marcado
  hasSelectedEmployees(): boolean {
    return this.employees.some(emp => emp.selected);
  }

  // Elimina un empleado específico
  deleteEmployee(employee: Employee) {
    // Mostrar confirmación antes de eliminar
    const confirmDelete = window.confirm('¿Estás seguro de que quieres eliminar el empleado seleccionado?');
    
    if (confirmDelete) {
      // Si la confirmación es positiva, activar el estado de carga
      this.isLoading = true;
      
      // Simula un retraso para simular la carga
      setTimeout(() => {
        // Eliminar el empleado de la lista
        this.employees = this.employees.filter(emp => emp.id !== employee.id);
  
        // Al finalizar la eliminación, desactivar el estado de carga
        this.isLoading = false;
      }, 1000); // 1000ms = 1 segundo de retraso
    }
  }

  // Edita un empleado
  editEmployee(employee: Employee) {
    console.log('Edit employee:', employee);
    // Aquí agregas la lógica para editar el empleado
  }

  // Agregar un nuevo empleado (puedes implementar esta funcionalidad)
  addNewEmployee() {
    console.log('Add new employee');
    this.router.navigate(['/admin']); // Redirigir al login
    // Aquí agregas la lógica para agregar un nuevo empleado
  }
}