import { Component, OnInit, ViewChild } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Reporte } from '../interfaces/models';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';


import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonButton,
  IonInput,
} from '@ionic/angular/standalone';
import { ColumnMode, DatatableComponent, NgxDatatableModule } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-reporteadmin',
  templateUrl: './reporteadmin.page.html',
  styleUrls: ['./reporteadmin.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
  ],
})
export class ReporteadminPage implements OnInit {
  reportes: Reporte[] = [];

  

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<Reporte[]>('http://192.168.1.84:3000/reporte-asistencia').subscribe(
      data => this.reportes = data
    );
    
  }

  
   
}