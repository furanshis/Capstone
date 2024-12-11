import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Reporte } from '../../interfaces/models';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map, switchMap } from 'rxjs/operators';
import { Observable, from } from 'rxjs';
import { AsistenciaserviceService } from 'src/app/services/asistenciaservice.service';
import { ReporteAsistencia } from '../../interfaces/models';

@Component({
  selector: 'app-registro-asistencia',
  templateUrl: './registro-asistencia.page.html',
  styleUrls: ['./registro-asistencia.page.scss'],
})
export class RegistroAsistenciaPage implements OnInit {
  reportes: any[] = [];


  constructor(private http: HttpClient, private asistenciaService: AsistenciaserviceService,
    private firestore: AngularFirestore,
    private auth: AngularFireAuth
  ) {}

  ngOnInit() {
    this.obtenerReportesConEmpleados();
  }
  

  async obtenerReportesConEmpleados() {
    const reportesSnapshot = await this.firestore
      .collection('reporte_asistencia')
      .ref.get();

    const reportes = await Promise.all(
      reportesSnapshot.docs.map(async (reporteDoc) => {
        const reporte = reporteDoc.data() as ReporteAsistencia;;
        const empleadoDoc = await this.firestore
          .collection('empleado')
          .doc(reporte.uid)
          .ref.get();

        return {
          ...reporte,
          empleado: empleadoDoc.exists ? empleadoDoc.data() : null,
        };
      })
    );

    return reportes;
  }
  

}
