/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PacienteEntity } from '../paciente/paciente.entity/paciente.entity';
import { MedicoEntity } from '../medico/medico.entity/medico.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class PacienteMedicoService {
  constructor(
    @InjectRepository(PacienteEntity)
    private readonly pacienteRepository: Repository<PacienteEntity>,

    @InjectRepository(MedicoEntity)
    private readonly medicoRepository: Repository<MedicoEntity>,
  ) {}

  async addMedicoToPaciente(pacienteId: string, medicoId: string): Promise<PacienteEntity> {
    // Verificar si el médico existe
    const medico: MedicoEntity = await this.medicoRepository.findOne({ where: { id: medicoId } });
    if (!medico) {
      throw new BusinessLogicException('El médico con el id dado no fue encontrado', BusinessError.NOT_FOUND);
    }

    // Verificar si el paciente existe
    const paciente: PacienteEntity = await this.pacienteRepository.findOne({
      where: { id: pacienteId },
      relations: ['medicos'],
    });
    if (!paciente) {
      throw new BusinessLogicException('El paciente con el id dado no fue encontrado', BusinessError.NOT_FOUND);
    }

    // Validar que el paciente no tenga más de 5 médicos asignados
    if (paciente.medicos.length >= 5) {
      throw new BusinessLogicException(
        'El paciente no puede tener más de 5 médicos asignados',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    // Asignar el médico al paciente
    paciente.medicos = [...paciente.medicos, medico];

    // Guardar los cambios en la base de datos
    return await this.pacienteRepository.save(paciente);
  }

  async findMedicosByPacienteId(pacienteId: string): Promise<MedicoEntity[]> {
    const paciente: PacienteEntity = await this.pacienteRepository.findOne({
      where: { id: pacienteId },
      relations: ['medicos'],
    });
    if (!paciente) {
      throw new BusinessLogicException('El paciente con el id dado no fue encontrado', BusinessError.NOT_FOUND);
    }
    return paciente.medicos;
  }

  async deleteMedicoFromPaciente(pacienteId: string, medicoId: string): Promise<void> {
    const paciente: PacienteEntity = await this.pacienteRepository.findOne({
      where: { id: pacienteId },
      relations: ['medicos'],
    });
    if (!paciente) {
      throw new BusinessLogicException('El paciente con el id dado no fue encontrado', BusinessError.NOT_FOUND);
    }

    const medico: MedicoEntity = paciente.medicos.find((medico) => medico.id === medicoId);
    if (!medico) {
      throw new BusinessLogicException(
        'El médico con el id dado no está asociado al paciente',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    paciente.medicos = paciente.medicos.filter((medico) => medico.id !== medicoId);
    await this.pacienteRepository.save(paciente);
  }
}
