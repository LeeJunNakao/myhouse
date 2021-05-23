import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { House as IHouse } from '../../../../../domain/House';

@Entity()
export class House implements IHouse {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  userId: number;

  @Column('varchar', { length: 60 })
  name: string;

  @Column('int', { array: true })
  members: number[];
}
