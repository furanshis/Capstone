import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Empleados } from './empleados.entity';
@Injectable()

export class EmpleadosService {

    constructor(
        @InjectRepository(Empleados)
        private empleadosRepository: Repository<Empleados>
    ){}

    // Crear un nuevo empleado
  async createEmpleado(data: Partial<Empleados>): Promise<Empleados> {
    try {
      const empleado = this.empleadosRepository.create(data);
      return this.empleadosRepository.save(empleado);
    } catch (error) {
      return error;
    }
    
  }

  // Obtener un empleado por UID
  async getEmpleadoByUid(uid: string): Promise<Empleados> {
    try {
      const empleado = await this.empleadosRepository.findOne({where: { uid_empleado: uid }});
      console.log(uid)

      console.log(empleado)
      return empleado;
    } catch (error) {
      return error;
    }
  }


  // Método para obtener un empleado por ID
  async getEmpleadoById(id: number): Promise<Empleados> {
    try {
      console.log(id)
      const empleado = await this.empleadosRepository.findOne({ where: { id_empleado: id } });
      console.log(empleado)
      return empleado
    }catch (error) {
      return error;
    }
  }

  // Obtener todos los empleados
  async getAllEmpleados(): Promise<Empleados[]> {
    return this.empleadosRepository.find();
  }

  // Método para validar el PIN del empleado
  async validatePin(uid: string, pin: string): Promise<boolean> {
    const empleado = await this.getEmpleadoByUid(uid);

    if (empleado.pin !== pin) {
      throw new UnauthorizedException('PIN incorrecto');
    }

    return true;
  }

}

