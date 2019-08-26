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
  Personage,
  Animatie,
} from '../models';
import { PersonageRepository } from '../repositories';
import { authenticate } from '@loopback/authentication';

export class PersonageAnimatieController {
  constructor(
    @repository(PersonageRepository) protected personageRepository: PersonageRepository,
  ) { }

  @get('/personages/{id}/animaties', {
    responses: {
      '200': {
        description: 'Array of Animatie\'s belonging to Personage',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': Animatie } },
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Animatie>,
  ): Promise<Animatie[]> {
    return await this.personageRepository.animaties(id).find(filter);
  }

  @post('/personages/{id}/animaties', {
    responses: {
      '200': {
        description: 'Personage model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Animatie } } },
      },
    },
  })
  @authenticate('jwt')
  async create(
    @param.path.number('id') id: typeof Personage.prototype.ID,
    @requestBody() animatie: Animatie,
  ): Promise<Animatie> {
    return await this.personageRepository.animaties(id).create(animatie);
  }

  @patch('/personages/{id}/animaties', {
    responses: {
      '200': {
        description: 'Personage.Animatie PATCH success count',
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
          schema: getModelSchemaRef(Animatie, { partial: true }),
        },
      },
    })
    animatie: Partial<Animatie>,
    @param.query.object('where', getWhereSchemaFor(Animatie)) where?: Where<Animatie>,
  ): Promise<Count> {
    return await this.personageRepository.animaties(id).patch(animatie, where);
  }

  @del('/personages/{id}/animaties', {
    responses: {
      '200': {
        description: 'Personage.Animatie DELETE success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  @authenticate('jwt')
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Animatie)) where?: Where<Animatie>,
  ): Promise<Count> {
    return await this.personageRepository.animaties(id).delete(where);
  }
}
