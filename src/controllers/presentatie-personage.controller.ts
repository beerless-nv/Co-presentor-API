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
import { PresentatiePersonage } from '../models';
import { PresentatiePersonageRepository } from '../repositories';
import { authenticate } from '@loopback/authentication';

export class PresentatiePersonageController {
  constructor(
    @repository(PresentatiePersonageRepository)
    public presentatiePersonageRepository: PresentatiePersonageRepository,
  ) { }

  @post('/presentatie-personages', {
    responses: {
      '200': {
        description: 'PresentatiePersonage model instance',
        content: { 'application/json': { schema: { 'x-ts-type': PresentatiePersonage } } },
      },
    },
  })
  @authenticate('jwt')
  async create(@requestBody() presentatiePersonage: PresentatiePersonage): Promise<PresentatiePersonage> {
    return await this.presentatiePersonageRepository.create(presentatiePersonage);
  }

  @get('/presentatie-personages/count', {
    responses: {
      '200': {
        description: 'PresentatiePersonage model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  @authenticate('jwt')
  async count(
    @param.query.object('where', getWhereSchemaFor(PresentatiePersonage)) where?: Where<PresentatiePersonage>,
  ): Promise<Count> {
    return await this.presentatiePersonageRepository.count(where);
  }

  @get('/presentatie-personages', {
    responses: {
      '200': {
        description: 'Array of PresentatiePersonage model instances',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': PresentatiePersonage } },
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async find(
    @param.query.object('filter', getFilterSchemaFor(PresentatiePersonage)) filter?: Filter<PresentatiePersonage>,
  ): Promise<PresentatiePersonage[]> {
    return await this.presentatiePersonageRepository.find(filter);
  }

  @patch('/presentatie-personages', {
    responses: {
      '200': {
        description: 'PresentatiePersonage PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  @authenticate('jwt')
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PresentatiePersonage, { partial: true }),
        },
      },
    })
    presentatiePersonage: PresentatiePersonage,
    @param.query.object('where', getWhereSchemaFor(PresentatiePersonage)) where?: Where<PresentatiePersonage>,
  ): Promise<Count> {
    return await this.presentatiePersonageRepository.updateAll(presentatiePersonage, where);
  }

  @get('/presentatie-personages/{id}', {
    responses: {
      '200': {
        description: 'PresentatiePersonage model instance',
        content: { 'application/json': { schema: { 'x-ts-type': PresentatiePersonage } } },
      },
    },
  })
  @authenticate('jwt')
  async findById(@param.path.number('id') id: number): Promise<PresentatiePersonage> {
    return await this.presentatiePersonageRepository.findById(id);
  }

  @patch('/presentatie-personages/{id}', {
    responses: {
      '204': {
        description: 'PresentatiePersonage PATCH success',
      },
    },
  })
  @authenticate('jwt')
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PresentatiePersonage, { partial: true }),
        },
      },
    })
    presentatiePersonage: PresentatiePersonage,
  ): Promise<void> {
    await this.presentatiePersonageRepository.updateById(id, presentatiePersonage);
  }

  @put('/presentatie-personages/{id}', {
    responses: {
      '204': {
        description: 'PresentatiePersonage PUT success',
      },
    },
  })
  @authenticate('jwt')
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() presentatiePersonage: PresentatiePersonage,
  ): Promise<void> {
    await this.presentatiePersonageRepository.replaceById(id, presentatiePersonage);
  }

  @del('/presentatie-personages/{id}', {
    responses: {
      '204': {
        description: 'PresentatiePersonage DELETE success',
      },
    },
  })
  @authenticate('jwt')
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.presentatiePersonageRepository.deleteById(id);
  }
}
