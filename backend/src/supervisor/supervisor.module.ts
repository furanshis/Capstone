import { Module } from '@nestjs/common';
import { SupervisorController } from './supervisor.controller';
import { SupervisorService } from './supervisor.service';
import { Supervisor } from './supervisor.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Supervisor])],
  controllers: [SupervisorController],
  providers: [SupervisorService]
})
export class SupervisorModule {}
