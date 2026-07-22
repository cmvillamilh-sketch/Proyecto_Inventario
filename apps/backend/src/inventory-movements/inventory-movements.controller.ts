import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query, UseGuards } from '@nestjs/common';
import { InventoryMovementsService } from './inventory-movements.service';
import { CreateInventoryMovementDto } from './dto/create-inventory-movement.dto';
import { FindInventoryMovementsDto } from './dto/find-inventory-movements.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, CurrentUserPayload } from '../auth/decorators/current-user.decorator';

@Controller('inventory-movements')
@UseGuards(JwtAuthGuard)
export class InventoryMovementsController {
  constructor(private readonly inventoryMovementsService: InventoryMovementsService) {}

  @Get()
  findAll(@Query() query: FindInventoryMovementsDto) {
    return this.inventoryMovementsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.inventoryMovementsService.findOne(id);
  }

  @Post()
  create(@Body() body: CreateInventoryMovementDto, @CurrentUser() currentUser: CurrentUserPayload) {
    return this.inventoryMovementsService.create(body, currentUser.username);
  }
}
