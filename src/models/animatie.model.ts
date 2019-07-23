import {Entity, model, property} from '@loopback/repository';

@model({settings: {}})
export class Animatie extends Entity {
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
  lengte?: number;

  @property({
    type: 'number',
  })
  personageID?: number;

  constructor(data?: Partial<Animatie>) {
    super(data);
  }
}

export interface AnimatieRelations {
  // describe navigational properties here
}

export type AnimatieWithRelations = Animatie & AnimatieRelations;
