import {Entity, model, property} from '@loopback/repository';

@model({settings: {}})
export class RegistrationToken extends Entity {
  @property({
    type: 'number',
    id: true,
  })
  ID?: number;

  @property({
    type: 'string',
    required: true,
  })
  token: string;

  @property({
    type: 'number',
  })
  userId?: number;

  constructor(data?: Partial<RegistrationToken>) {
    super(data);
  }
}

export interface RegistrationTokenRelations {
  // describe navigational properties here
}

export type RegistrationTokenWithRelations = RegistrationToken & RegistrationTokenRelations;
