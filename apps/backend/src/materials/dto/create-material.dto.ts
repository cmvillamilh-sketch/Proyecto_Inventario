import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateMaterialDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsNotEmpty()
  unitOfMeasure: string;

  @IsInt()
  minimumStock: number;

  @IsInt()
  @IsOptional()
  @Min(0)
  unitValue?: number;
}
