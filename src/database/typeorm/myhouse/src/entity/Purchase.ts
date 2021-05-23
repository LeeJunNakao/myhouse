import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { House } from './House';

@Entity()
export class Purchase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  userId: number;

  @ManyToOne(type => House)
  @JoinColumn()
  house: House;

  @Column('bigint')
  date: number;

  @Column('varchar', { length: 60 })
  description: string;

  @Column('int')
  value: number;
}
