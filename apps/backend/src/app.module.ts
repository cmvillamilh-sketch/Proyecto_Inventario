import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { MaterialsModule } from './materials/materials.module';
import { InventoryMovementsModule } from './inventory-movements/inventory-movements.module';

const envFilePath = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(__dirname, '..', '..', '..', '.env'),
  '.env',
];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/mante_stock',
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV !== 'production',
      logging: true,
    }),
    AuthModule,
    MaterialsModule,
    InventoryMovementsModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
