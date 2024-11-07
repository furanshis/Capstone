import { Module } from '@nestjs/common';
import { SupervisorController } from './supervisor.controller';
import { SupervisorService } from './supervisor.service';

@Module({
  controllers: [SupervisorController],
  providers: [SupervisorService]
})
export class SupervisorModule {}
