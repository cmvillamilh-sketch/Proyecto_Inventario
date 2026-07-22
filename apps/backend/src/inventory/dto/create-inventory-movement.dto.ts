import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator';
import { InventoryMovementType } from '../inventory-movement.entity';

export class CreateInventoryMovementDto {
  @IsString()
  @IsNotEmpty()
  materialId: string;

  @IsEnum(InventoryMovementType)
  movementType: InventoryMovementType;

  @IsInt()
  @IsPositive()
  quantity: number;

  @IsOptional()
  @IsString()
  observation?: string;

  @IsOptional()
  @IsString()
  user?: string;
}
