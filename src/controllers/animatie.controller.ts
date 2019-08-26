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
import { Animatie } from '../models';
import { AnimatieRepository } from '../repositories';
import { authenticate } from '@loopback/authentication';

export class AnimatieController {
  constructor(
    @repository(AnimatieRepository)
    public animatieRepository: AnimatieRepository,
  ) {
  }

  @post('/animaties', {
    responses: {
      '200': {
        description: 'Animatie model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Animatie } } },
      },
    },
  })
  @authenticate('jwt')
  async create(@requestBody() animatie: Animatie): Promise<Animatie> {
    return await this.animatieRepository.create(animatie);
  }

  @get('/animaties/count', {
    responses: {
      '200': {
        description: 'Animatie model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  @authenticate('jwt')
  async count(
    @param.query.object('where', getWhereSchemaFor(Animatie)) where?: Where<Animatie>,
  ): Promise<Count> {
    return await this.animatieRepository.count(where);
  }

  @get('/animaties', {
    responses: {
      '200': {
        description: 'Array of Animatie model instances',
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
    @param.query.object('filter', getFilterSchemaFor(Animatie)) filter?: Filter<Animatie>,
  ): Promise<Animatie[]> {
    return await this.animatieRepository.find(filter);
  }

  @patch('/animaties', {
    responses: {
      '200': {
        description: 'Animatie PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  @authenticate('jwt')
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Animatie, { partial: true }),
        },
      },
    })
    animatie: Animatie,
    @param.query.object('where', getWhereSchemaFor(Animatie)) where?: Where<Animatie>,
  ): Promise<Count> {
    return await this.animatieRepository.updateAll(animatie, where);
  }

  @get('/animaties/{id}', {
    responses: {
      '200': {
        description: 'Animatie model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Animatie } } },
      },
    },
  })
  @authenticate('jwt')
  async findById(@param.path.number('id') id: number): Promise<Animatie> {
    return await this.animatieRepository.findById(id);
  }

  @patch('/animaties/{id}', {
    responses: {
      '204': {
        description: 'Animatie PATCH success',
      },
    },
  })
  @authenticate('jwt')
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Animatie, { partial: true }),
        },
      },
    })
    animatie: Animatie,
  ): Promise<void> {
    await this.animatieRepository.updateById(id, animatie);
  }

  @put('/animaties/{id}', {
    responses: {
      '204': {
        description: 'Animatie PUT success',
      },
    },
  })
  @authenticate('jwt')
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() animatie: Animatie,
  ): Promise<void> {
    await this.animatieRepository.replaceById(id, animatie);
  }

  @del('/animaties/{id}', {
    responses: {
      '204': {
        description: 'Animatie DELETE success',
      },
    },
  })
  @authenticate('jwt')
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.animatieRepository.deleteById(id);
  }
}
