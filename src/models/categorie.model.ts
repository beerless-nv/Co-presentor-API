import {Entity, model, property} from '@loopback/repository';

@model({settings: {}})
export class Categorie extends Entity {
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

  @property({
    type: 'string',
  })
  beschrijving?: string;


  constructor(data?: Partial<Categorie>) {
    super(data);
  }
}

export interface CategorieRelations {
  // describe navigational properties here
}

export type CategorieWithRelations = Categorie & CategorieRelations;
