import {Entity, model, property, hasMany, belongsTo} from '@loopback/repository';
import {Animatie} from './animatie.model';
import {Categorie} from './categorie.model';

@model({settings: {}})
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

  @hasMany(() => Animatie, {keyTo: 'personageID'})
  animaties: Animatie[];

  @belongsTo(() => Categorie)
  categorieID: number;

  constructor(data?: Partial<Personage>) {
    super(data);
  }
}

export interface PersonageRelations {
  // describe navigational properties here
}

export type PersonageWithRelations = Personage & PersonageRelations;
