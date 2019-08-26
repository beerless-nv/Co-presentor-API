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
import { Personage } from '../models';
import { PersonageRepository } from '../repositories';
import { authenticate } from '@loopback/authentication';

export class PersonageController {
  constructor(
    @repository(PersonageRepository)
    public personageRepository: PersonageRepository,
  ) { }

  @post('/personages', {
    responses: {
      '200': {
        description: 'Personage model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Personage } } },
      },
    },
  })
  @authenticate('jwt')
  async create(@requestBody() personage: Personage): Promise<Personage> {
    return await this.personageRepository.create(personage);
  }

  @get('/personages/count', {
    responses: {
      '200': {
        description: 'Personage model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  @authenticate('jwt')
  async count(
    @param.query.object('where', getWhereSchemaFor(Personage)) where?: Where<Personage>,
  ): Promise<Count> {
    return await this.personageRepository.count(where);
  }

  @get('/personages', {
    responses: {
      '200': {
        description: 'Array of Personage model instances',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': Personage } },
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async find(
    @param.query.object('filter', getFilterSchemaFor(Personage)) filter?: Filter<Personage>,
  ): Promise<Personage[]> {
    return await this.personageRepository.find(filter);
  }

  @patch('/personages', {
    responses: {
      '200': {
        description: 'Personage PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  @authenticate('jwt')
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Personage, { partial: true }),
        },
      },
    })
    personage: Personage,
    @param.query.object('where', getWhereSchemaFor(Personage)) where?: Where<Personage>,
  ): Promise<Count> {
    return await this.personageRepository.updateAll(personage, where);
  }

  @get('/personages/{id}', {
    responses: {
      '200': {
        description: 'Personage model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Personage } } },
      },
    },
  })
  @authenticate('jwt')
  async findById(@param.path.number('id') id: number): Promise<Personage> {
    return await this.personageRepository.findById(id);
  }

  @patch('/personages/{id}', {
    responses: {
      '204': {
        description: 'Personage PATCH success',
      },
    },
  })
  @authenticate('jwt')
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Personage, { partial: true }),
        },
      },
    })
    personage: Personage,
  ): Promise<void> {
    await this.personageRepository.updateById(id, personage);
  }

  @put('/personages/{id}', {
    responses: {
      '204': {
        description: 'Personage PUT success',
      },
    },
  })
  @authenticate('jwt')
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() personage: Personage,
  ): Promise<void> {
    await this.personageRepository.replaceById(id, personage);
  }

  @del('/personages/{id}', {
    responses: {
      '204': {
        description: 'Personage DELETE success',
      },
    },
  })
  @authenticate('jwt')
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.personageRepository.deleteById(id);
  }
}
