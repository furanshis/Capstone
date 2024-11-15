import { Controller, Get, Post, Body, Param, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
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
    
    // Ruta para obtener un empleado por ID
    @Get(':id')
    async getEmpleadoById(@Param('id', ParseIntPipe) id: number): Promise<Empleados> {
        return this.empleadosService.getEmpleadoById(id);
    }
    // Endpoint para obtener todos los empleados
    @Get()
    async getAllEmpleados(): Promise<Empleados[]> {
        return this.empleadosService.getAllEmpleados();
    }

    // Endpoint para validar el PIN del empleado
    @Post('validar-pin')
    async validarPin(@Body() body: { uid: string; pin: string }): Promise<boolean> {
      const { uid, pin } = body;
      return this.empleadosService.validarPin(uid, pin); // Retorna true o false
    }
    
}