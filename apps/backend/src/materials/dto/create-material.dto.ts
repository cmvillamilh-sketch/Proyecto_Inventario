import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

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
  @Min(0)
  minimumStock: number;
}
