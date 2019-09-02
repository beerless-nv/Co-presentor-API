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
import { ZwevendeTekst } from '../models';
import { ZwevendeTekstRepository } from '../repositories';

export class ZwevendeTekstController {
  constructor(
    @repository(ZwevendeTekstRepository)
    public zwevendeTekstRepository: ZwevendeTekstRepository,
  ) { }

  @post('/zwevende-teksten', {
    responses: {
      '200': {
        description: 'ZwevendeTekst model instance',
        content: { 'application/json': { schema: { 'x-ts-type': ZwevendeTekst } } },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ZwevendeTekst, { exclude: ['ID'] }),
        },
      },
    })
    zwevendeTekst: Omit<ZwevendeTekst, 'id'>,
  ): Promise<ZwevendeTekst> {
    return await this.zwevendeTekstRepository.create(zwevendeTekst);
  }

  @get('/zwevende-teksten/count', {
    responses: {
      '200': {
        description: 'ZwevendeTekst model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(ZwevendeTekst)) where?: Where<ZwevendeTekst>,
  ): Promise<Count> {
    return await this.zwevendeTekstRepository.count(where);
  }

  @get('/zwevende-teksten', {
    responses: {
      '200': {
        description: 'Array of ZwevendeTekst model instances',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': ZwevendeTekst } },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(ZwevendeTekst)) filter?: Filter<ZwevendeTekst>,
  ): Promise<ZwevendeTekst[]> {
    return await this.zwevendeTekstRepository.find(filter);
  }

  @patch('/zwevende-teksten', {
    responses: {
      '200': {
        description: 'ZwevendeTekst PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ZwevendeTekst, { partial: true }),
        },
      },
    })
    zwevendeTekst: ZwevendeTekst,
    @param.query.object('where', getWhereSchemaFor(ZwevendeTekst)) where?: Where<ZwevendeTekst>,
  ): Promise<Count> {
    return await this.zwevendeTekstRepository.updateAll(zwevendeTekst, where);
  }

  @get('/zwevende-teksten/{id}', {
    responses: {
      '200': {
        description: 'ZwevendeTekst model instance',
        content: { 'application/json': { schema: { 'x-ts-type': ZwevendeTekst } } },
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<ZwevendeTekst> {
    return await this.zwevendeTekstRepository.findById(id);
  }

  @patch('/zwevende-teksten/{id}', {
    responses: {
      '204': {
        description: 'ZwevendeTekst PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ZwevendeTekst, { partial: true }),
        },
      },
    })
    zwevendeTekst: ZwevendeTekst,
  ): Promise<void> {
    await this.zwevendeTekstRepository.updateById(id, zwevendeTekst);
  }

  @put('/zwevende-teksten/{id}', {
    responses: {
      '204': {
        description: 'ZwevendeTekst PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() zwevendeTekst: ZwevendeTekst,
  ): Promise<void> {
    await this.zwevendeTekstRepository.replaceById(id, zwevendeTekst);
  }

  @del('/zwevende-teksten/{id}', {
    responses: {
      '204': {
        description: 'ZwevendeTekst DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.zwevendeTekstRepository.deleteById(id);
  }
}
