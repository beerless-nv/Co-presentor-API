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
import {Definitie} from '../models';
import {DefinitieRepository} from '../repositories';

export class DefinitieController {
  constructor(
    @repository(DefinitieRepository)
    public definitieRepository : DefinitieRepository,
  ) {}

  @post('/definities', {
    responses: {
      '200': {
        description: 'Definitie model instance',
        content: {'application/json': {schema: {'x-ts-type': Definitie}}},
      },
    },
  })
  async create(@requestBody() definitie: Definitie): Promise<Definitie> {
    return await this.definitieRepository.create(definitie);
  }

  @get('/definities/count', {
    responses: {
      '200': {
        description: 'Definitie model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Definitie)) where?: Where<Definitie>,
  ): Promise<Count> {
    return await this.definitieRepository.count(where);
  }

  @get('/definities', {
    responses: {
      '200': {
        description: 'Array of Definitie model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: {'x-ts-type': Definitie}},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Definitie)) filter?: Filter<Definitie>,
  ): Promise<Definitie[]> {
    return await this.definitieRepository.find(filter);
  }

  @patch('/definities', {
    responses: {
      '200': {
        description: 'Definitie PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Definitie, {partial: true}),
        },
      },
    })
    definitie: Definitie,
    @param.query.object('where', getWhereSchemaFor(Definitie)) where?: Where<Definitie>,
  ): Promise<Count> {
    return await this.definitieRepository.updateAll(definitie, where);
  }

  @get('/definities/{id}', {
    responses: {
      '200': {
        description: 'Definitie model instance',
        content: {'application/json': {schema: {'x-ts-type': Definitie}}},
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<Definitie> {
    return await this.definitieRepository.findById(id);
  }

  @patch('/definities/{id}', {
    responses: {
      '204': {
        description: 'Definitie PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Definitie, {partial: true}),
        },
      },
    })
    definitie: Definitie,
  ): Promise<void> {
    await this.definitieRepository.updateById(id, definitie);
  }

  @put('/definities/{id}', {
    responses: {
      '204': {
        description: 'Definitie PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() definitie: Definitie,
  ): Promise<void> {
    await this.definitieRepository.replaceById(id, definitie);
  }

  @del('/definities/{id}', {
    responses: {
      '204': {
        description: 'Definitie DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.definitieRepository.deleteById(id);
  }
}
