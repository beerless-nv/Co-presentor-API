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
import {Slide} from '../models';
import {SlideRepository} from '../repositories';

export class SlideController {
  constructor(
    @repository(SlideRepository)
    public slideRepository : SlideRepository,
  ) {}

  @post('/slides', {
    responses: {
      '200': {
        description: 'Slide model instance',
        content: {'application/json': {schema: {'x-ts-type': Slide}}},
      },
    },
  })
  async create(@requestBody() slide: Slide): Promise<Slide> {
    return await this.slideRepository.create(slide);
  }

  @get('/slides/count', {
    responses: {
      '200': {
        description: 'Slide model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Slide)) where?: Where<Slide>,
  ): Promise<Count> {
    return await this.slideRepository.count(where);
  }

  @get('/slides', {
    responses: {
      '200': {
        description: 'Array of Slide model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: {'x-ts-type': Slide}},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Slide)) filter?: Filter<Slide>,
  ): Promise<Slide[]> {
    return await this.slideRepository.find(filter);
  }

  @patch('/slides', {
    responses: {
      '200': {
        description: 'Slide PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Slide, {partial: true}),
        },
      },
    })
    slide: Slide,
    @param.query.object('where', getWhereSchemaFor(Slide)) where?: Where<Slide>,
  ): Promise<Count> {
    return await this.slideRepository.updateAll(slide, where);
  }

  @get('/slides/{id}', {
    responses: {
      '200': {
        description: 'Slide model instance',
        content: {'application/json': {schema: {'x-ts-type': Slide}}},
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<Slide> {
    return await this.slideRepository.findById(id);
  }

  @patch('/slides/{id}', {
    responses: {
      '204': {
        description: 'Slide PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Slide, {partial: true}),
        },
      },
    })
    slide: Slide,
  ): Promise<void> {
    await this.slideRepository.updateById(id, slide);
  }

  @put('/slides/{id}', {
    responses: {
      '204': {
        description: 'Slide PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() slide: Slide,
  ): Promise<void> {
    await this.slideRepository.replaceById(id, slide);
  }

  @del('/slides/{id}', {
    responses: {
      '204': {
        description: 'Slide DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.slideRepository.deleteById(id);
  }
}
