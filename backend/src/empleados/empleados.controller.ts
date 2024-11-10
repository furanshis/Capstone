import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { EmpleadosService } from './empleados.service';
import { Empleados } from './empleados.entity';

@Controller('empleados')
export class EmpleadosController {
    constructor(private readonly empleadosService: EmpleadosService){}
    // Endpoint para crear un nuevo empleado
    @Post()
    async createEmpleado(@Body() data: Partial<Empleados>): Promise<Empleados> {
        return this.empleadosService.createEmpleado(data);
    }
    // Endpoint para obtener un empleado por UID
    @Get(':uid')
    async getEmpleadoByUid(@Param('uid') uid: string): Promise<Empleados> {
        return this.empleadosService.getEmpleadoByUid(uid);
    }
    // Endpoint para obtener todos los empleados
    @Get()
    async getAllEmpleados(): Promise<Empleados[]> {
        return this.empleadosService.getAllEmpleados();
    }
}