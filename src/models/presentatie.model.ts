import { Entity, model, property, hasMany } from '@loopback/repository';
import { Slide } from './slide.model';
import { Synoniem } from './synoniem.model';
import {ZwevendeTekst} from './zwevende-tekst.model';

@model({ settings: {} })
export class Presentatie extends Entity {
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
  url?: string;

  @property({
    type: 'string',
  })
  beschrijving?: string;

  @hasMany(() => Slide, { keyTo: 'presentatieID' })
  slides: Slide[];

  @hasMany(() => Synoniem)
  synoniems: Synoniem[];

  @hasMany(() => ZwevendeTekst)
  zwevendeTeksts: ZwevendeTekst[];

  constructor(data?: Partial<Presentatie>) {
    super(data);
  }
}

export interface PresentatieRelations {
  // describe navigational properties here
}

export type PresentatieWithRelations = Presentatie & PresentatieRelations;
