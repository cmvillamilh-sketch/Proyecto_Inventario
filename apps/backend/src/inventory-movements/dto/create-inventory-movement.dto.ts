import { IsEnum, IsInt, IsNotEmpty, IsString, IsUUID, MaxLength, Min } from 'class-validator';
import { MovementType } from '../enums/movement-type.enum';

export class CreateInventoryMovementDto {
  @IsUUID()
  materialId: string;

  @IsEnum(MovementType)
  type: MovementType;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  reason: string;
}
