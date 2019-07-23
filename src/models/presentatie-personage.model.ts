import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Presentatie} from './presentatie.model';
import {Personage} from './personage.model';

@model({settings: {}})
export class PresentatiePersonage extends Entity {
  @property({
    type: 'number',
    id: true,
  })
  ID?: number;

  @belongsTo(() => Presentatie)
  presentatieID: number;

  @belongsTo(() => Personage)
  personageID: number;

  constructor(data?: Partial<PresentatiePersonage>) {
    super(data);
  }
}

export interface PresentatiePersonageRelations {
  // describe navigational properties here
}

export type PresentatiePersonageWithRelations = PresentatiePersonage & PresentatiePersonageRelations;
