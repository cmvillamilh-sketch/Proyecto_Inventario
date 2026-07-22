import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Material } from '../materials/material.entity';

export enum InventoryMovementType {
  ENTRADA = 'Entrada',
  SALIDA = 'Salida',
  AJUSTE = 'Ajuste',
}

@Entity({ name: 'inventory_movements' })
export class InventoryMovement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Material, { nullable: false, eager: true })
  @JoinColumn({ name: 'material_id' })
  material: Material;

  @Column({ type: 'enum', enum: InventoryMovementType })
  movementType: InventoryMovementType;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'int' })
  previousStock: number;

  @Column({ type: 'int' })
  newStock: number;

  @Column({ type: 'varchar', length: 500, default: '' })
  observation: string;

  @Column({ type: 'varchar', length: 100, default: 'system' })
  user: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
