import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  User,
  RegistrationToken,
} from '../models';
import { UserRepository } from '../repositories';
import { authenticate } from '@loopback/authentication';

export class UserRegistrationTokenController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @get('/users/{id}/registration-tokens', {
    responses: {
      '200': {
        description: 'Array of RegistrationToken\'s belonging to User',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': RegistrationToken } },
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<RegistrationToken>,
  ): Promise<RegistrationToken[]> {
    return await this.userRepository.registrationTokens(id).find(filter);
  }

  @post('/users/{id}/registration-tokens', {
    responses: {
      '200': {
        description: 'User model instance',
        content: { 'application/json': { schema: { 'x-ts-type': RegistrationToken } } },
      },
    },
  })
  @authenticate('jwt')
  async create(
    @param.path.number('id') id: typeof User.prototype.ID,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RegistrationToken, { exclude: ['ID'] }),
        },
      },
    }) registrationToken: Omit<RegistrationToken, 'id'>,
  ): Promise<RegistrationToken> {
    return await this.userRepository.registrationTokens(id).create(registrationToken);
  }

  @patch('/users/{id}/registration-tokens', {
    responses: {
      '200': {
        description: 'User.RegistrationToken PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  @authenticate('jwt')
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RegistrationToken, { partial: true }),
        },
      },
    })
    registrationToken: Partial<RegistrationToken>,
    @param.query.object('where', getWhereSchemaFor(RegistrationToken)) where?: Where<RegistrationToken>,
  ): Promise<Count> {
    return await this.userRepository.registrationTokens(id).patch(registrationToken, where);
  }

  @del('/users/{id}/registration-tokens', {
    responses: {
      '200': {
        description: 'User.RegistrationToken DELETE success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  @authenticate('jwt')
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(RegistrationToken)) where?: Where<RegistrationToken>,
  ): Promise<Count> {
    return await this.userRepository.registrationTokens(id).delete(where);
  }
}
