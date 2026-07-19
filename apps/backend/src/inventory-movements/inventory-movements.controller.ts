import { Body, Controller, Get, Param, ParseUUIDPipe, Post, UseGuards } from '@nestjs/common';
import { InventoryMovementsService } from './inventory-movements.service';
import { CreateInventoryMovementDto } from './dto/create-inventory-movement.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('inventory-movements')
@UseGuards(JwtAuthGuard)
export class InventoryMovementsController {
  constructor(private readonly inventoryMovementsService: InventoryMovementsService) {}

  @Get()
  findAll() {
    return this.inventoryMovementsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.inventoryMovementsService.findOne(id);
  }

  @Post()
  create(@Body() body: CreateInventoryMovementDto) {
    return this.inventoryMovementsService.create(body);
  }
}
