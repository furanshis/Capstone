import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Reporte } from '../../interfaces/models';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, switchMap } from 'rxjs/operators';
import { Observable, from } from 'rxjs';

@Component({
  selector: 'app-registro-asistencia',
  templateUrl: './registro-asistencia.page.html',
  styleUrls: ['./registro-asistencia.page.scss'],
})
export class RegistroAsistenciaPage implements OnInit {
  reportes: any[] = [];
  reportesFiltrados: any[] = []; // Reportes después de aplicar filtros

  filtro = {
    fecha: '',
    nombreEmpleado: '',
  };


  constructor(private http: HttpClient, private firestore: AngularFirestore) {}

  ngOnInit() {
    this.cargarReportes();
    this.http.get<Reporte[]>('http://192.168.1.85:3000/reporte-asistencia').subscribe(
      data => this.reportes = data
    );
    
  }

  cargarReportes() {
    this.obtenerReportesConEmpleados().subscribe({
      next: (data) => {
        this.reportes = data;
        console.log('Datos cargados:', this.reportes);
      },
      error: (error) => console.error('Error al cargar reportes:', error),
    });
  }

  obtenerReportesConEmpleados(): Observable<any[]> {
    return this.firestore
      .collection('reporte_asistencia')
      .valueChanges({ idField: 'id' })
      .pipe(
        switchMap((reportes: any[]) => {
          const consultas = reportes.map((reporte) =>
            from(
              this.firestore
                .collection('empleado')
                .doc(reporte.uid)
                .get()
                .toPromise()
            ).pipe(
              map((empleadoDoc) => ({
                ...reporte,
                empleado: empleadoDoc?.exists ? empleadoDoc.data() : null,
              }))
            )
          );
          return from(Promise.all(consultas));
        })
      );
  }

  aplicarFiltros() {
    this.reportesFiltrados = this.reportes.filter((reporte) => {
      const coincideFecha =
        !this.filtro.fecha || reporte.fecha_reporte.startsWith(this.filtro.fecha);
      const coincideNombre =
        !this.filtro.nombreEmpleado ||
        `${reporte.asistencia.empleado.primer_nombre} ${reporte.asistencia.empleado.apellido_paterno}`
          .toLowerCase()
          .includes(this.filtro.nombreEmpleado.toLowerCase());
      return coincideFecha && coincideNombre;
    });
  }
}
