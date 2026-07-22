import { IsDateString, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { MovementType } from '../enums/movement-type.enum';

export class FindInventoryMovementsDto {
  @IsUUID()
  @IsOptional()
  materialId?: string;

  @IsEnum(MovementType)
  @IsOptional()
  type?: MovementType;

  @IsString()
  @IsOptional()
  createdBy?: string;

  @IsDateString()
  @IsOptional()
  dateFrom?: string;

  @IsDateString()
  @IsOptional()
  dateTo?: string;
}
