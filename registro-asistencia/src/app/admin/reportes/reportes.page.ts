import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Reporte } from '../../interfaces/models';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.page.html',
  styleUrls: ['./reportes.page.scss'],
})
export class ReportesPage implements OnInit {
  reportes: Reporte[] = [];


  constructor(private readonly http: HttpClient) { }

  ngOnInit() {
    this.http.get<Reporte[]>('http://localhost:3000/reportes').subscribe(
      data => this.reportes = data
    );
  }

}
