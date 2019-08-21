import {Entity, model, property} from '@loopback/repository';

@model({settings: {}})
export class Synoniem extends Entity {
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
    type: 'number',
  })
  presentatieId?: number;

  @property({
    type: 'number',
  })
  definitieId?: number;

  constructor(data?: Partial<Synoniem>) {
    super(data);
  }
}

export interface SynoniemRelations {
  // describe navigational properties here
}

export type SynoniemWithRelations = Synoniem & SynoniemRelations;
