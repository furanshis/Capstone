import { Controller, Get, Post, Body, Param, ParseIntPipe, Patch, HttpException, HttpStatus } from '@nestjs/common';
import { AsistenciaService } from './asistencia.service';
import { Asistencia } from './asistencia.entity';
import { CreateAsistenciaDto } from './create-asistencia.dto';
import { UpdateHoraDto } from './update-hora.dto';

@Controller('asistencia')
export class AsistenciaController {
    constructor(private readonly asistenciaService: AsistenciaService) {}

  // Obtener todas las asistencias
  @Get()
  async getAllAsistencias(): Promise<Asistencia[]> {
    return this.asistenciaService.getAllAsistencias();
  }

  // Obtener asistencias por empleado ID
  @Get('empleado/:empleadoId')
  async getAsistenciasByEmpleadoId(
    @Param('empleadoId', ParseIntPipe) empleadoId: number,
  ): Promise<Asistencia[]> {
    return this.asistenciaService.getAsistenciasByEmpleadoId(empleadoId);
  }

  @Get('verificar/:uid')
  async verificarAsistencia(@Param('uid') uid: string): Promise<any> {
    try {
      const existe = await this.asistenciaService.verificarAsistencia(uid);
      return { registrada: existe }; // Retorna si ya está registrada
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Crear una nueva asistencia
  @Post()
  async createAsistencia(@Body() createAsistenciaDto: CreateAsistenciaDto): Promise<Asistencia> {
    return this.asistenciaService.createAsistencia(createAsistenciaDto);
  }

  @Patch(':id/entrada')
  marcarEntrada(@Param('id') id: number, @Body() updateHoraDto: UpdateHoraDto) {
    return this.asistenciaService.marcarEntrada(id, updateHoraDto);
  }

  @Patch(':id/salida')
  marcarSalida(@Param('id') id: number, @Body() updateHoraDto: UpdateHoraDto) {
    return this.asistenciaService.marcarSalida(id, updateHoraDto);
  }
}
