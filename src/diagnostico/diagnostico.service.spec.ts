/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DiagnosticoService } from './diagnostico.service';
import { DiagnosticoEntity } from './diagnostico.entity/diagnostico.entity';
import { faker } from '@faker-js/faker';
import { PacienteEntity } from 'src/paciente/paciente.entity/paciente.entity';

describe('DiagnosticoService', () => {
  let service: DiagnosticoService;
  let repository: Repository<DiagnosticoEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DiagnosticoService,
        {
          provide: getRepositoryToken(DiagnosticoEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<DiagnosticoService>(DiagnosticoService);
    repository = module.get<Repository<DiagnosticoEntity>>(getRepositoryToken(DiagnosticoEntity));
  });

  it('create should create a diagnosis successfully', async () => {
    const diagnostico: DiagnosticoEntity = {
      id: '',
      nombre: 'Diagnóstico A',
      descripcion: faker.lorem.sentence(),
      paciente: new PacienteEntity
    };

    jest.spyOn(repository, 'save').mockResolvedValueOnce(diagnostico);

    const result = await service.create(diagnostico);
    expect(result).not.toBeNull();
    expect(result.descripcion.length).toBeLessThanOrEqual(200);
  });

  it('create should throw an exception if description exceeds 200 characters', async () => {
    const diagnostico: DiagnosticoEntity = {
      id: '',
      nombre: 'Diagnóstico B',
      descripcion: faker.lorem.paragraphs(3),
      paciente: new PacienteEntity
    };

    await expect(service.create(diagnostico)).rejects.toHaveProperty('message', 'La descripción no puede tener más de 200 caracteres');
  });
});

