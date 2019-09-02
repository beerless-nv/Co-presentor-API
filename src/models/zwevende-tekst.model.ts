import {Entity, model, property} from '@loopback/repository';

@model({settings: {}})
export class ZwevendeTekst extends Entity {
  @property({
    type: 'number',
    id: true,
  })
  ID?: number;

  @property({
    type: 'string',
  })
  tekst?: string;

  @property({
    type: 'string',
  })
  ssml?: string;

  @property({
    type: 'number',
  })
  presentatieId?: number;

  constructor(data?: Partial<ZwevendeTekst>) {
    super(data);
  }
}

export interface ZwevendeTekstRelations {
  // describe navigational properties here
}

export type ZwevendeTekstWithRelations = ZwevendeTekst & ZwevendeTekstRelations;
