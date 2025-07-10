import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  linkedinId: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;
}