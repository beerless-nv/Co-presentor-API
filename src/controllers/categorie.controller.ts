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
import {Categorie} from '../models';
import {CategorieRepository} from '../repositories';

export class CategorieController {
  constructor(
    @repository(CategorieRepository)
    public categorieRepository : CategorieRepository,
  ) {}

  @post('/categories', {
    responses: {
      '200': {
        description: 'Categorie model instance',
        content: {'application/json': {schema: {'x-ts-type': Categorie}}},
      },
    },
  })
  async create(@requestBody() categorie: Categorie): Promise<Categorie> {
    return await this.categorieRepository.create(categorie);
  }

  @get('/categories/count', {
    responses: {
      '200': {
        description: 'Categorie model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Categorie)) where?: Where<Categorie>,
  ): Promise<Count> {
    return await this.categorieRepository.count(where);
  }

  @get('/categories', {
    responses: {
      '200': {
        description: 'Array of Categorie model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: {'x-ts-type': Categorie}},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Categorie)) filter?: Filter<Categorie>,
  ): Promise<Categorie[]> {
    return await this.categorieRepository.find(filter);
  }

  @patch('/categories', {
    responses: {
      '200': {
        description: 'Categorie PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Categorie, {partial: true}),
        },
      },
    })
    categorie: Categorie,
    @param.query.object('where', getWhereSchemaFor(Categorie)) where?: Where<Categorie>,
  ): Promise<Count> {
    return await this.categorieRepository.updateAll(categorie, where);
  }

  @get('/categories/{id}', {
    responses: {
      '200': {
        description: 'Categorie model instance',
        content: {'application/json': {schema: {'x-ts-type': Categorie}}},
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<Categorie> {
    return await this.categorieRepository.findById(id);
  }

  @patch('/categories/{id}', {
    responses: {
      '204': {
        description: 'Categorie PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Categorie, {partial: true}),
        },
      },
    })
    categorie: Categorie,
  ): Promise<void> {
    await this.categorieRepository.updateById(id, categorie);
  }

  @put('/categories/{id}', {
    responses: {
      '204': {
        description: 'Categorie PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() categorie: Categorie,
  ): Promise<void> {
    await this.categorieRepository.replaceById(id, categorie);
  }

  @del('/categories/{id}', {
    responses: {
      '204': {
        description: 'Categorie DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.categorieRepository.deleteById(id);
  }
}
