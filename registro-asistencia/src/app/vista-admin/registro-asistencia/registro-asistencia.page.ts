import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Reporte } from '../../interfaces/models';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registro-asistencia',
  templateUrl: './registro-asistencia.page.html',
  styleUrls: ['./registro-asistencia.page.scss'],
})
export class RegistroAsistenciaPage implements OnInit {
  reportes: Reporte[] = [];
  reportesFiltrados: any[] = []; // Reportes después de aplicar filtros

  filtro = {
    fecha: '',
    nombreEmpleado: '',
  };


  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<Reporte[]>('http://192.168.1.85:3000/reporte-asistencia').subscribe(
      data => this.reportes = data
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
