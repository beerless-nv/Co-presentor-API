import { Entity, model, property } from '@loopback/repository';

@model({ settings: {} })
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
    type: 'string',
  })
  afbeelding?: string;

  @property({
    type: 'number',
  })
  presentatieID?: number;

  @property({
    type: 'string',
    required: false,
    jsonSchema: { nullable: true },
  })
  video?: string;

  constructor(data?: Partial<Slide>) {
    super(data);
  }
}

export interface SlideRelations {
  // describe navigational properties here
}

export type SlideWithRelations = Slide & SlideRelations;
