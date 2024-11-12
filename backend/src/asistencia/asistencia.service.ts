import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Asistencia } from './asistencia.entity';
import { Repository } from 'typeorm';
import { CreateAsistenciaDto } from './create-asistencia.dto';
import { UpdateHoraDto } from './update-hora.dto';

@Injectable()
export class AsistenciaService {
    constructor(
        @InjectRepository(Asistencia)
        private asistenciaRepository: Repository<Asistencia>,
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
