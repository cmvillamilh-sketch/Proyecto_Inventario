import { IsEnum, IsInt, IsOptional, IsPositive, IsString } from 'class-validator';
import { InventoryMovementType } from '../inventory-movement.entity';

export class UpdateInventoryMovementDto {
  @IsOptional()
  @IsEnum(InventoryMovementType)
  movementType?: InventoryMovementType;

  @IsOptional()
  @IsInt()
  @IsPositive()
  quantity?: number;

  @IsOptional()
  @IsString()
  observation?: string;

  @IsOptional()
  @IsString()
  user?: string;
}
