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
import {TtsInstellingen} from '../models';
import {TtsInstellingenRepository} from '../repositories';

export class TtsInstellingenController {
  constructor(
    @repository(TtsInstellingenRepository)
    public ttsInstellingenRepository : TtsInstellingenRepository,
  ) {}

  @post('/tts-instellingen', {
    responses: {
      '200': {
        description: 'TtsInstellingen model instance',
        content: {'application/json': {schema: getModelSchemaRef(TtsInstellingen)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TtsInstellingen, {exclude: ['ID']}),
        },
      },
    })
    ttsInstellingen: Omit<TtsInstellingen, 'ID'>,
  ): Promise<TtsInstellingen> {
    return this.ttsInstellingenRepository.create(ttsInstellingen);
  }

  @get('/tts-instellingen/count', {
    responses: {
      '200': {
        description: 'TtsInstellingen model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(TtsInstellingen)) where?: Where<TtsInstellingen>,
  ): Promise<Count> {
    return this.ttsInstellingenRepository.count(where);
  }

  @get('/tts-instellingen', {
    responses: {
      '200': {
        description: 'Array of TtsInstellingen model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(TtsInstellingen)},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(TtsInstellingen)) filter?: Filter<TtsInstellingen>,
  ): Promise<TtsInstellingen[]> {
    return this.ttsInstellingenRepository.find(filter);
  }

  @patch('/tts-instellingen', {
    responses: {
      '200': {
        description: 'TtsInstellingen PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TtsInstellingen, {partial: true}),
        },
      },
    })
    ttsInstellingen: TtsInstellingen,
    @param.query.object('where', getWhereSchemaFor(TtsInstellingen)) where?: Where<TtsInstellingen>,
  ): Promise<Count> {
    return this.ttsInstellingenRepository.updateAll(ttsInstellingen, where);
  }

  @get('/tts-instellingen/{id}', {
    responses: {
      '200': {
        description: 'TtsInstellingen model instance',
        content: {'application/json': {schema: getModelSchemaRef(TtsInstellingen)}},
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<TtsInstellingen> {
    return this.ttsInstellingenRepository.findById(id);
  }

  @patch('/tts-instellingen/{id}', {
    responses: {
      '204': {
        description: 'TtsInstellingen PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TtsInstellingen, {partial: true}),
        },
      },
    })
    ttsInstellingen: TtsInstellingen,
  ): Promise<void> {
    await this.ttsInstellingenRepository.updateById(id, ttsInstellingen);
  }

  @put('/tts-instellingen/{id}', {
    responses: {
      '204': {
        description: 'TtsInstellingen PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() ttsInstellingen: TtsInstellingen,
  ): Promise<void> {
    await this.ttsInstellingenRepository.replaceById(id, ttsInstellingen);
  }

  @del('/tts-instellingen/{id}', {
    responses: {
      '204': {
        description: 'TtsInstellingen DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.ttsInstellingenRepository.deleteById(id);
  }
}
