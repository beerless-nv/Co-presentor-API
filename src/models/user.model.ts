import { Entity, model, property, hasMany} from '@loopback/repository';
import {RegistrationToken} from './registration-token.model';

@model({ settings: {} })
export class User extends Entity {
  @property({
    type: 'number',
    id: true,
  })
  ID?: number;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

  @property({
    type: 'string',
  })
  firstName: string;

  @property({
    type: 'string',
  })
  lastName: string;

  @property({
    type: 'string',
  })
  code: string;

  @hasMany(() => RegistrationToken)
  registrationTokens: RegistrationToken[];

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
