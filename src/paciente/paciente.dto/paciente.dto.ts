/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString, IsIn, Length } from 'class-validator';

export class PacienteDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 255)
  readonly nombre: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['Masculino', 'Femenino', 'Otro']) // Restringe el género a valores permitidos
  readonly genero: string;
}
