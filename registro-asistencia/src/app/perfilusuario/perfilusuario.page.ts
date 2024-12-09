import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfilusuario',
  templateUrl: './perfilusuario.page.html',
  styleUrls: ['./perfilusuario.page.scss'],
})
export class PerfilusuarioPage implements OnInit {

  primerNombre: string = '';
  segundoNombre: string = '';
  apellidoPaterno: string = '';
  apellidoMaterno: string = '';
  nombreEmpresa: string = '';
  horarioEntrada: string = '';
  horarioSalida: string = '';

  uidEmpleado: string = '';

  goBack() {
    this.router.navigate(['/inicio']);
  }

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  

}
