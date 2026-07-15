import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { MaterialsService } from './materials.service';

class CreateMaterialDto {
  code: string;
  description: string;
  category: string;
  unitOfMeasure: string;
  minimumStock: number;
}

class UpdateMaterialDto {
  code?: string;
  description?: string;
  category?: string;
  unitOfMeasure?: string;
  minimumStock?: number;
}

@Controller('materials')
export class MaterialsController {
  constructor(private readonly materialsService: MaterialsService) {}

  @Get()
  findAll() {
    return this.materialsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.materialsService.findOne(id);
  }

  @Post()
  create(@Body() body: CreateMaterialDto) {
    return this.materialsService.create(body);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: UpdateMaterialDto) {
    return this.materialsService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.materialsService.remove(id);
  }
}
