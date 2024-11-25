/* eslint-disable prettier/prettier */
import { TypeOrmModule } from '@nestjs/typeorm';
import { PacienteEntity } from '../../paciente/paciente.entity/paciente.entity';
import { MedicoEntity } from '../../medico/medico.entity/medico.entity';
import { DiagnosticoEntity } from '../../diagnostico/diagnostico.entity/diagnostico.entity';


export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [PacienteEntity, MedicoEntity, DiagnosticoEntity],
    synchronize: true,
    keepConnectionAlive: true 
  }),
  TypeOrmModule.forFeature([PacienteEntity, MedicoEntity, DiagnosticoEntity]),
];