/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/business-errors';
import { Repository } from 'typeorm';
import { DiagnosticoEntity } from './diagnostico.entity/diagnostico.entity';

@Injectable()
export class DiagnosticoService {
  constructor(
    @InjectRepository(DiagnosticoEntity)
    private readonly diagnosticoRepository: Repository<DiagnosticoEntity>,
  ) {}

  async findAll(): Promise<DiagnosticoEntity[]> {
    return await this.diagnosticoRepository.find();
  }

  async findOne(id: string): Promise<DiagnosticoEntity> {
    const diagnostico: DiagnosticoEntity = await this.diagnosticoRepository.findOne({
      where: { id },
    });
    if (!diagnostico)
      throw new BusinessLogicException(
        'El diagnostico con el id proporcionado no fue encontrado',
        BusinessError.NOT_FOUND,
      );

    return diagnostico;
  }

  async create(diagnostico: DiagnosticoEntity): Promise<DiagnosticoEntity> {
    if (diagnostico.descripcion.length > 200)
      throw new BusinessLogicException(
        'La descripcion debe tener como maximo 200 caracteres',
        BusinessError.PRECONDITION_FAILED,
      );

    return await this.diagnosticoRepository.save(diagnostico);
  }

  async update(id: string, diagnostico: DiagnosticoEntity): Promise<DiagnosticoEntity> {
    const persistedDiagnostico: DiagnosticoEntity = await this.diagnosticoRepository.findOne({
      where: { id },
    });
    if (!persistedDiagnostico)
      throw new BusinessLogicException(
        'el diagnostico con el id proporcionado no fue encontrado',
        BusinessError.NOT_FOUND,
      );

    if (diagnostico.descripcion.length > 200)
      throw new BusinessLogicException(
        'La descripcion debe tener como maximo 200 caracteres',
        BusinessError.PRECONDITION_FAILED,
      );

    diagnostico.id = id;

    return await this.diagnosticoRepository.save(diagnostico);
  }

  async delete(id: string) {
    const diagnostico: DiagnosticoEntity = await this.diagnosticoRepository.findOne({
      where: { id },
    });
    if (!diagnostico)
      throw new BusinessLogicException(
        'El diagnostico con el id proporcionado no fue encontrado',
        BusinessError.NOT_FOUND,
      );

    await this.diagnosticoRepository.remove(diagnostico);
    }
}