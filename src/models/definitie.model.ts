import { Entity, model, property, belongsTo } from '@loopback/repository';

@model({ settings: {} })
export class Definitie extends Entity {
  @property({
    type: 'number',
    id: true,
  })
  ID?: number;

  @property({
    type: 'string',
    required: true,
    index: {
      unique: true
    }
  })
  naam: string;

  @property({
    type: 'string',
  })
  tekst?: string;

  constructor(data?: Partial<Definitie>) {
    super(data);
  }
}

export interface DefinitieRelations {
  // describe navigational properties here
}

export type DefinitieWithRelations = Definitie & DefinitieRelations;
