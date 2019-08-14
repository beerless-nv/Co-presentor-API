import { Entity, model, property, hasMany, belongsTo } from '@loopback/repository';
import { Animatie } from './animatie.model';

@model({ settings: {} })
export class Personage extends Entity {
  @property({
    type: 'number',
    id: true,
  })
  ID?: number;

  @property({
    type: 'string',
    required: true,
  })
  naam: string;

  @hasMany(() => Animatie, { keyTo: 'personageID' })
  animaties: Animatie[];

  constructor(data?: Partial<Personage>) {
    super(data);
  }
}

export interface PersonageRelations {
  // describe navigational properties here
}

export type PersonageWithRelations = Personage & PersonageRelations;
