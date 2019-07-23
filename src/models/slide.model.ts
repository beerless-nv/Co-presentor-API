import {Entity, model, property} from '@loopback/repository';

@model({settings: {}})
export class Slide extends Entity {
  @property({
    type: 'number',
    id: true,
  })
  ID?: number;

  @property({
    type: 'number',
    required: true,
  })
  volgnummer: number;

  @property({
    type: 'string',
  })
  tekst?: string;

  @property({
    type: 'number',
  })
  presentatieID?: number;

  constructor(data?: Partial<Slide>) {
    super(data);
  }
}

export interface SlideRelations {
  // describe navigational properties here
}

export type SlideWithRelations = Slide & SlideRelations;
