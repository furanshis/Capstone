import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Asistencia } from './asistencia.entity';
import { Repository } from 'typeorm';
import { CreateAsistenciaDto } from './create-asistencia.dto';
import { UpdateHoraDto } from './update-hora.dto';
import { Empleados } from 'src/empleados/empleados.entity';

@Injectable()
export class AsistenciaService {
    constructor(
        @InjectRepository(Asistencia)
        private asistenciaRepository: Repository<Asistencia>,
        @InjectRepository(Empleados)
      private readonly empleadoRepository: Repository<Empleados>,
    ) {}

    // Obtener todas las asistencias
  async getAllAsistencias(): Promise<Asistencia[]> {
    return await this.asistenciaRepository.find();
  }

  // Obtener asistencias por empleado
  async getAsistenciasByEmpleadoId(empleadoId: number): Promise<Asistencia[]> {
    return await this.asistenciaRepository.find({ where: { empleado: { id_empleado: empleadoId } }, relations: ['empleado'] });
  }

  // Crear una nueva asistencia
  async createAsistencia(createAsistenciaDto: CreateAsistenciaDto): Promise<Asistencia> {
    const nuevaAsistencia = this.asistenciaRepository.create(createAsistenciaDto);
    return await this.asistenciaRepository.save(nuevaAsistencia);
  }

  // Verificar si ya existe una asistencia registrada para un empleado en el día actual
  async verificarAsistencia(uid: string): Promise<boolean> {
    const empleado = await this.empleadoRepository.findOne({
      where: { uid_empleado: uid },
    });

    if (!empleado) {
      throw new Error('Empleado no encontrado');
    }

    const fechaHoy = new Date()
    fechaHoy.setHours(0, 0, 0, 0);
    const asistenciaExistente = await this.asistenciaRepository.findOne({
      where: {
        empleado: empleado,
        fecha_asistencia: fechaHoy,
      },
    });

    return asistenciaExistente ? true : false; // Devuelve true si existe una asistencia
  }

  async marcarEntrada(id: number, updateHoraDto: UpdateHoraDto): Promise<Asistencia> {
    await this.asistenciaRepository.update(id, {
      hora_entrada: updateHoraDto.hora,
    });

    // Retornar la asistencia actualizada
    return this.asistenciaRepository.findOne({
      where: { id_asistencia: id },
    })
  }

  async marcarSalida(id: number, updateHoraDto: UpdateHoraDto): Promise<Asistencia> {
    await this.asistenciaRepository.update(id, {
      hora_salida: updateHoraDto.hora,
    });

    // Retornar la asistencia actualizada
    return this.asistenciaRepository.findOne({ where: { id_asistencia: id } });
  }
}
