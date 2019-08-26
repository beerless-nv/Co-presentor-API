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
  Presentatie,
  Synoniem,
} from '../models';
import { PresentatieRepository } from '../repositories';
import { authenticate } from '@loopback/authentication';

export class PresentatieSynoniemController {
  constructor(
    @repository(PresentatieRepository) protected presentatieRepository: PresentatieRepository,
  ) { }

  @get('/presentaties/{id}/synoniems', {
    responses: {
      '200': {
        description: 'Array of Synoniem\'s belonging to Presentatie',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': Synoniem } },
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Synoniem>,
  ): Promise<Synoniem[]> {
    return await this.presentatieRepository.synoniems(id).find(filter);
  }

  @post('/presentaties/{id}/synoniems', {
    responses: {
      '200': {
        description: 'Presentatie model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Synoniem } } },
      },
    },
  })
  @authenticate('jwt')
  async create(
    @param.path.number('id') id: typeof Presentatie.prototype.ID,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Synoniem, { exclude: ['ID'] }),
        },
      },
    }) synoniem: Omit<Synoniem, 'id'>,
  ): Promise<Synoniem> {
    return await this.presentatieRepository.synoniems(id).create(synoniem);
  }

  @patch('/presentaties/{id}/synoniems', {
    responses: {
      '200': {
        description: 'Presentatie.Synoniem PATCH success count',
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
          schema: getModelSchemaRef(Synoniem, { partial: true }),
        },
      },
    })
    synoniem: Partial<Synoniem>,
    @param.query.object('where', getWhereSchemaFor(Synoniem)) where?: Where<Synoniem>,
  ): Promise<Count> {
    return await this.presentatieRepository.synoniems(id).patch(synoniem, where);
  }

  @del('/presentaties/{id}/synoniems', {
    responses: {
      '200': {
        description: 'Presentatie.Synoniem DELETE success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  @authenticate('jwt')
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Synoniem)) where?: Where<Synoniem>,
  ): Promise<Count> {
    return await this.presentatieRepository.synoniems(id).delete(where);
  }
}
