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
  Slide,
} from '../models';
import { PresentatieRepository } from '../repositories';
import { authenticate } from '@loopback/authentication';

export class PresentatieSlideController {
  constructor(
    @repository(PresentatieRepository) protected presentatieRepository: PresentatieRepository,
  ) { }

  @get('/presentaties/{id}/slides', {
    responses: {
      '200': {
        description: 'Array of Slide\'s belonging to Presentatie',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': Slide } },
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Slide>,
  ): Promise<Slide[]> {
    return await this.presentatieRepository.slides(id).find(filter);
  }

  @post('/presentaties/{id}/slides', {
    responses: {
      '200': {
        description: 'Presentatie model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Slide } } },
      },
    },
  })
  @authenticate('jwt')
  async create(
    @param.path.number('id') id: typeof Presentatie.prototype.ID,
    @requestBody() slide: Slide,
  ): Promise<Slide> {
    return await this.presentatieRepository.slides(id).create(slide);
  }

  @patch('/presentaties/{id}/slides', {
    responses: {
      '200': {
        description: 'Presentatie.Slide PATCH success count',
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
          schema: getModelSchemaRef(Slide, { partial: true }),
        },
      },
    })
    slide: Partial<Slide>,
    @param.query.object('where', getWhereSchemaFor(Slide)) where?: Where<Slide>,
  ): Promise<Count> {
    return await this.presentatieRepository.slides(id).patch(slide, where);
  }

  @del('/presentaties/{id}/slides', {
    responses: {
      '200': {
        description: 'Presentatie.Slide DELETE success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  @authenticate('jwt')
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Slide)) where?: Where<Slide>,
  ): Promise<Count> {
    return await this.presentatieRepository.slides(id).delete(where);
  }
}
