/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { PacienteMedicoService } from './paciente-medico.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PacienteEntity } from '../paciente/paciente.entity/paciente.entity';
import { MedicoEntity } from '../medico/medico.entity/medico.entity';
import { faker } from '@faker-js/faker';

describe('PacienteMedicoService', () => {
  let service: PacienteMedicoService;
  let pacienteRepository: Repository<PacienteEntity>;
  let medicoRepository: Repository<MedicoEntity>;
  let paciente: PacienteEntity;
  let medicosList: MedicoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PacienteMedicoService],
    }).compile();

    service = module.get<PacienteMedicoService>(PacienteMedicoService);
    pacienteRepository = module.get<Repository<PacienteEntity>>(getRepositoryToken(PacienteEntity));
    medicoRepository = module.get<Repository<MedicoEntity>>(getRepositoryToken(MedicoEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    medicoRepository.clear();
    pacienteRepository.clear();

    medicosList = [];
    for (let i = 0; i < 5; i++) {
      const medico: MedicoEntity = await medicoRepository.save({
        nombre: faker.name.firstName(),
        especialidad: faker.lorem.word(),
        telefono: faker.phone.number(),
      });
      medicosList.push(medico);
    }

    paciente = await pacienteRepository.save({
      nombre: faker.name.firstName(),
      genero: 'Masculino',
      medicos: medicosList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addMedicoToPaciente should add a medico to a paciente', async () => {
    const newMedico: MedicoEntity = await medicoRepository.save({
      nombre: faker.name.firstName(),
      especialidad: 'Dermatología',
      telefono: faker.phone.number(),
    });

    const result: PacienteEntity = await service.addMedicoToPaciente(paciente.id, newMedico.id);

    expect(result.medicos.length).toBe(6);
    expect(result.medicos).toContainEqual(newMedico);
  });

  it('addMedicoToPaciente should throw an exception for invalid medico', async () => {
    await expect(service.addMedicoToPaciente(paciente.id, '0')).rejects.toHaveProperty(
      'message',
      'El médico con el id dado no fue encontrado',
    );
  });

  it('addMedicoToPaciente should throw an exception for invalid paciente', async () => {
    const newMedico: MedicoEntity = await medicoRepository.save({
      nombre: faker.name.firstName(),
      especialidad: 'Neurología',
      telefono: faker.phone.number(),
    });

    await expect(service.addMedicoToPaciente('0', newMedico.id)).rejects.toHaveProperty(
      'message',
      'El paciente con el id dado no fue encontrado',
    );
  });

  it('addMedicoToPaciente should throw an exception if paciente has more than 5 medicos', async () => {
    const newMedico: MedicoEntity = await medicoRepository.save({
      nombre: faker.name.firstName(),
      especialidad: 'Cardiología',
      telefono: faker.phone.number(),
    });

    // Adding a 6th medico
    await service.addMedicoToPaciente(paciente.id, newMedico.id);

    const extraMedico: MedicoEntity = await medicoRepository.save({
      nombre: faker.name.firstName(),
      especialidad: 'Gastroenterología',
      telefono: faker.phone.number(),
    });

    await expect(service.addMedicoToPaciente(paciente.id, extraMedico.id)).rejects.toHaveProperty(
      'message',
      'El paciente no puede tener más de 5 médicos asignados',
    );
  });

  it('findMedicosByPacienteId should return medicos of a paciente', async () => {
    const medicos: MedicoEntity[] = await service.findMedicosByPacienteId(paciente.id);
    expect(medicos.length).toBe(5);
  });

  it('findMedicosByPacienteId should throw an exception for invalid paciente', async () => {
    await expect(service.findMedicosByPacienteId('0')).rejects.toHaveProperty(
      'message',
      'El paciente con el id dado no fue encontrado',
    );
  });

  it('deleteMedicoFromPaciente should remove a medico from a paciente', async () => {
    const medico: MedicoEntity = medicosList[0];

    await service.deleteMedicoFromPaciente(paciente.id, medico.id);

    const updatedPaciente: PacienteEntity = await pacienteRepository.findOne({
      where: { id: paciente.id },
      relations: ['medicos'],
    });

    expect(updatedPaciente.medicos.length).toBe(4);
    expect(updatedPaciente.medicos).not.toContainEqual(medico);
  });

  it('deleteMedicoFromPaciente should throw an exception for invalid medico', async () => {
    await expect(service.deleteMedicoFromPaciente(paciente.id, '0')).rejects.toHaveProperty(
      'message',
      'El médico con el id dado no fue encontrado',
    );
  });

  it('deleteMedicoFromPaciente should throw an exception for invalid paciente', async () => {
    const medico: MedicoEntity = medicosList[0];
    await expect(service.deleteMedicoFromPaciente('0', medico.id)).rejects.toHaveProperty(
      'message',
      'El paciente con el id dado no fue encontrado',
    );
  });

  it('deleteMedicoFromPaciente should throw an exception for medico not associated to paciente', async () => {
    const newMedico: MedicoEntity = await medicoRepository.save({
      nombre: faker.name.firstName(),
      especialidad: 'Reumatología',
      telefono: faker.phone.number(),
    });

    await expect(service.deleteMedicoFromPaciente(paciente.id, newMedico.id)).rejects.toHaveProperty(
      'message',
      'El médico con el id dado no está asociado al paciente',
    );
  });
});
