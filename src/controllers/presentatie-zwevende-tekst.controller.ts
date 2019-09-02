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
  ZwevendeTekst,
} from '../models';
import { PresentatieRepository } from '../repositories';

export class PresentatieZwevendeTekstController {
  constructor(
    @repository(PresentatieRepository) protected presentatieRepository: PresentatieRepository,
  ) { }

  @get('/presentaties/{id}/zwevende-teksts', {
    responses: {
      '200': {
        description: 'Array of ZwevendeTekst\'s belonging to Presentatie',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': ZwevendeTekst } },
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<ZwevendeTekst>,
  ): Promise<ZwevendeTekst[]> {
    return await this.presentatieRepository.zwevendeTeksts(id).find(filter);
  }

  @post('/presentaties/{id}/zwevende-teksts', {
    responses: {
      '200': {
        description: 'Presentatie model instance',
        content: { 'application/json': { schema: { 'x-ts-type': ZwevendeTekst } } },
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Presentatie.prototype.ID,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ZwevendeTekst, { exclude: ['ID'] }),
        },
      },
    }) zwevendeTekst: Omit<ZwevendeTekst, 'id'>,
  ): Promise<ZwevendeTekst> {
    return await this.presentatieRepository.zwevendeTeksts(id).create(zwevendeTekst);
  }

  @patch('/presentaties/{id}/zwevende-teksts', {
    responses: {
      '200': {
        description: 'Presentatie.ZwevendeTekst PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ZwevendeTekst, { partial: true }),
        },
      },
    })
    zwevendeTekst: Partial<ZwevendeTekst>,
    @param.query.object('where', getWhereSchemaFor(ZwevendeTekst)) where?: Where<ZwevendeTekst>,
  ): Promise<Count> {
    return await this.presentatieRepository.zwevendeTeksts(id).patch(zwevendeTekst, where);
  }

  @del('/presentaties/{id}/zwevende-teksts', {
    responses: {
      '200': {
        description: 'Presentatie.ZwevendeTekst DELETE success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(ZwevendeTekst)) where?: Where<ZwevendeTekst>,
  ): Promise<Count> {
    return await this.presentatieRepository.zwevendeTeksts(id).delete(where);
  }
}
