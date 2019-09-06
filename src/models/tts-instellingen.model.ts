import {Entity, model, property} from '@loopback/repository';

@model({settings: {}})
export class TtsInstellingen extends Entity {
  @property({
    type: 'number',
    id: true,
    required: true,
  })
  ID: number;

  @property({
    type: 'string',
    required: true,
  })
  naam: string;

  @property({
    type: 'string',
    required: true,
  })
  leesteken: string;

  @property({
    type: 'number',
    required: true,
  })
  waarde: number;


  constructor(data?: Partial<TtsInstellingen>) {
    super(data);
  }
}

export interface TtsInstellingenRelations {
  // describe navigational properties here
}

export type TtsInstellingenWithRelations = TtsInstellingen & TtsInstellingenRelations;
