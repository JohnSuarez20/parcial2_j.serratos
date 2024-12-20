/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MedicoModule } from './medico/medico.module';
import { PacienteModule } from './paciente/paciente.module';
import { DiagnosticoModule } from './diagnostico/diagnostico.module';
import { MedicoEntity } from './medico/medico.entity/medico.entity';
import { PacienteEntity } from './paciente/paciente.entity/paciente.entity';
import { DiagnosticoEntity } from './diagnostico/diagnostico.entity/diagnostico.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PacienteMedicoModule } from './paciente-medico/paciente-medico.module';

@Module({
  imports: [MedicoModule, PacienteModule, DiagnosticoModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'Millonarios15',
      database: 'hospital',
      entities: [MedicoEntity, PacienteEntity, DiagnosticoEntity],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true
    }),
    PacienteMedicoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
 })
 export class AppModule {}