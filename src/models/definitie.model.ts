import { Entity, model, property, belongsTo, hasMany} from '@loopback/repository';
import {Synoniem} from './synoniem.model';

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

  @hasMany(() => Synoniem)
  synoniems: Synoniem[];

  constructor(data?: Partial<Definitie>) {
    super(data);
  }
}

export interface DefinitieRelations {
  // describe navigational properties here
}

export type DefinitieWithRelations = Definitie & DefinitieRelations;
