import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { MaterialsService } from './materials.service';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';

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
