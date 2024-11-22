/* eslint-disable prettier/prettier */
import { DiagnosticoEntity } from 'src/diagnostico/diagnostico.entity/diagnostico.entity';
import { MedicoEntity } from 'src/medico/medico.entity/medico.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';

@Entity()
export class PacienteEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  nombre: string;

  @Column({ type: 'varchar', length: 50 })
  genero: string;

  @ManyToOne(() => MedicoEntity, (medico) => medico.pacientes)
  medico: MedicoEntity;

  @OneToMany(() => DiagnosticoEntity, (diagnostico) => diagnostico.paciente)
  diagnosticos: DiagnosticoEntity[];
}