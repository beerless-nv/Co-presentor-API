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
  Definitie,
  Synoniem,
} from '../models';
import { DefinitieRepository } from '../repositories';
import { authenticate } from '@loopback/authentication';

export class DefinitieSynoniemController {
  constructor(
    @repository(DefinitieRepository) protected definitieRepository: DefinitieRepository,
  ) { }

  @get('/definities/{id}/synoniems', {
    responses: {
      '200': {
        description: 'Array of Synoniem\'s belonging to Definitie',
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
    return await this.definitieRepository.synoniems(id).find(filter);
  }

  @post('/definities/{id}/synoniems', {
    responses: {
      '200': {
        description: 'Definitie model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Synoniem } } },
      },
    },
  })
  @authenticate('jwt')
  async create(
    @param.path.number('id') id: typeof Definitie.prototype.ID,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Synoniem, { exclude: ['ID'] }),
        },
      },
    }) synoniem: Omit<Synoniem, 'id'>,
  ): Promise<Synoniem> {
    return await this.definitieRepository.synoniems(id).create(synoniem);
  }

  @patch('/definities/{id}/synoniems', {
    responses: {
      '200': {
        description: 'Definitie.Synoniem PATCH success count',
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
    return await this.definitieRepository.synoniems(id).patch(synoniem, where);
  }

  @del('/definities/{id}/synoniems', {
    responses: {
      '200': {
        description: 'Definitie.Synoniem DELETE success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  @authenticate('jwt')
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Synoniem)) where?: Where<Synoniem>,
  ): Promise<Count> {
    return await this.definitieRepository.synoniems(id).delete(where);
  }
}
