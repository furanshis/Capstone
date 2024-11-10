import { Injectable } from '@nestjs/common';

@Injectable()
<<<<<<< HEAD
export class EmpleadosService {

    constructor(
        @InjectRepository(Empleados)
        private empleadosRepository: Repository<Empleados>
    ){}

    // Crear un nuevo empleado
  async createEmpleado(data: Partial<Empleados>): Promise<Empleados> {
    const empleado = this.empleadosRepository.create(data);
    return this.empleadosRepository.save(empleado);
  }

  // Obtener un empleado por UID
  async getEmpleadoByUid(uid: string): Promise<Empleados | undefined> {
    console.log(uid)
    const empleado = await this.empleadosRepository.findOneBy({ uid });
    console.log(empleado)
    return empleado;
  }

  // Obtener todos los empleados
  async getAllEmpleados(): Promise<Empleados[]> {
    return this.empleadosRepository.find();
  }

}



=======
export class EmpleadosService {}
>>>>>>> ee24c6e4330ec15d12643a7ea69136a624d46a97
