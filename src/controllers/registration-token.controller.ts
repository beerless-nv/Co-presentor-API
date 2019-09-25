import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getFilterSchemaFor,
  getModelSchemaRef,
  getWhereSchemaFor,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import {RegistrationToken} from '../models';
import {RegistrationTokenRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';

export class RegistrationTokenController {
  constructor(
    @repository(RegistrationTokenRepository)
    public registrationTokenRepository: RegistrationTokenRepository,
  ) {
  }

  @post('/registration-tokens', {
    responses: {
      '200': {
        description: 'RegistrationToken model instance',
        content: {'application/json': {schema: {'x-ts-type': RegistrationToken}}},
      },
    },
  })
  @authenticate('jwt')
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RegistrationToken, {exclude: ['ID']}),
        },
      },
    })
      registrationToken: Omit<RegistrationToken, 'id'>,
  ): Promise<any> {
    const registrationTokenMatches = await this.find({where: {and: [{token: registrationToken.token}, {userId: registrationToken.userId}]}});
    if (registrationTokenMatches.length > 0) {
      return;
    } else {
      return await this.registrationTokenRepository.create(registrationToken);
    }
  }

  @get('/registration-tokens/count', {
    responses: {
      '200': {
        description: 'RegistrationToken model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  @authenticate('jwt')
  async count(
    @param.query.object('where', getWhereSchemaFor(RegistrationToken)) where?: Where<RegistrationToken>,
  ): Promise<Count> {
    return await this.registrationTokenRepository.count(where);
  }

  @get('/registration-tokens', {
    responses: {
      '200': {
        description: 'Array of RegistrationToken model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: {'x-ts-type': RegistrationToken}},
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async find(
    @param.query.object('filter', getFilterSchemaFor(RegistrationToken)) filter?: Filter<RegistrationToken>,
  ): Promise<RegistrationToken[]> {
    return await this.registrationTokenRepository.find(filter);
  }

  @patch('/registration-tokens', {
    responses: {
      '200': {
        description: 'RegistrationToken PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  @authenticate('jwt')
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RegistrationToken, {partial: true}),
        },
      },
    })
      registrationToken: RegistrationToken,
    @param.query.object('where', getWhereSchemaFor(RegistrationToken)) where?: Where<RegistrationToken>,
  ): Promise<Count> {
    return await this.registrationTokenRepository.updateAll(registrationToken, where);
  }

  @get('/registration-tokens/{id}', {
    responses: {
      '200': {
        description: 'RegistrationToken model instance',
        content: {'application/json': {schema: {'x-ts-type': RegistrationToken}}},
      },
    },
  })
  @authenticate('jwt')
  async findById(@param.path.number('id') id: number): Promise<RegistrationToken> {
    return await this.registrationTokenRepository.findById(id);
  }

  @patch('/registration-tokens/{id}', {
    responses: {
      '204': {
        description: 'RegistrationToken PATCH success',
      },
    },
  })
  @authenticate('jwt')
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RegistrationToken, {partial: true}),
        },
      },
    })
      registrationToken: RegistrationToken,
  ): Promise<void> {
    await this.registrationTokenRepository.updateById(id, registrationToken);
  }

  @put('/registration-tokens/{id}', {
    responses: {
      '204': {
        description: 'RegistrationToken PUT success',
      },
    },
  })
  @authenticate('jwt')
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() registrationToken: RegistrationToken,
  ): Promise<void> {
    await this.registrationTokenRepository.replaceById(id, registrationToken);
  }

  @del('/registration-tokens/{id}', {
    responses: {
      '204': {
        description: 'RegistrationToken DELETE success',
      },
    },
  })
  @authenticate('jwt')
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.registrationTokenRepository.deleteById(id);
  }
}
