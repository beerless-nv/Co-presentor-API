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
import {Presentatie} from '../models';
import {PresentatieRepository} from '../repositories';

export class PresentatieController {
  constructor(
    @repository(PresentatieRepository)
    public presentatieRepository : PresentatieRepository,
  ) {}

  @post('/presentaties', {
    responses: {
      '200': {
        description: 'Presentatie model instance',
        content: {'application/json': {schema: {'x-ts-type': Presentatie}}},
      },
    },
  })
  async create(@requestBody() presentatie: Presentatie): Promise<Presentatie> {
    return await this.presentatieRepository.create(presentatie);
  }

  @get('/presentaties/count', {
    responses: {
      '200': {
        description: 'Presentatie model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Presentatie)) where?: Where<Presentatie>,
  ): Promise<Count> {
    return await this.presentatieRepository.count(where);
  }

  @get('/presentaties', {
    responses: {
      '200': {
        description: 'Array of Presentatie model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: {'x-ts-type': Presentatie}},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Presentatie)) filter?: Filter<Presentatie>,
  ): Promise<Presentatie[]> {
    return await this.presentatieRepository.find(filter);
  }

  @patch('/presentaties', {
    responses: {
      '200': {
        description: 'Presentatie PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Presentatie, {partial: true}),
        },
      },
    })
    presentatie: Presentatie,
    @param.query.object('where', getWhereSchemaFor(Presentatie)) where?: Where<Presentatie>,
  ): Promise<Count> {
    return await this.presentatieRepository.updateAll(presentatie, where);
  }

  @get('/presentaties/{id}', {
    responses: {
      '200': {
        description: 'Presentatie model instance',
        content: {'application/json': {schema: {'x-ts-type': Presentatie}}},
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<Presentatie> {
    return await this.presentatieRepository.findById(id);
  }

  @patch('/presentaties/{id}', {
    responses: {
      '204': {
        description: 'Presentatie PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Presentatie, {partial: true}),
        },
      },
    })
    presentatie: Presentatie,
  ): Promise<void> {
    await this.presentatieRepository.updateById(id, presentatie);
  }

  @put('/presentaties/{id}', {
    responses: {
      '204': {
        description: 'Presentatie PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() presentatie: Presentatie,
  ): Promise<void> {
    await this.presentatieRepository.replaceById(id, presentatie);
  }

  @del('/presentaties/{id}', {
    responses: {
      '204': {
        description: 'Presentatie DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.presentatieRepository.deleteById(id);
  }
}
