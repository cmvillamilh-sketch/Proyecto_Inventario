import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { InventoryMovement } from '../../inventory-movements/entities/inventory-movement.entity';

@Entity('materials')
export class Material {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string;

  @Column()
  description: string;

  @Column()
  category: string;

  @Column()
  unitOfMeasure: string;

  @Column('int')
  minimumStock: number;

  @Column('int')
  currentStock: number;

  @OneToMany(() => InventoryMovement, (movement) => movement.material)
  movements: InventoryMovement[];
}
