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
import {ChatbotCredentials} from '../models';
import {ChatbotCredentialsRepository} from '../repositories';

export class ChatbotCredentialsController {
  constructor(
    @repository(ChatbotCredentialsRepository)
    public chatbotCredentialsRepository : ChatbotCredentialsRepository,
  ) {}

  @post('/chatbot-credentials', {
    responses: {
      '200': {
        description: 'ChatbotCredentials model instance',
        content: {'application/json': {schema: {'x-ts-type': ChatbotCredentials}}},
      },
    },
  })
  async create(@requestBody() chatbotCredentials: ChatbotCredentials): Promise<ChatbotCredentials> {
    return await this.chatbotCredentialsRepository.create(chatbotCredentials);
  }

  @get('/chatbot-credentials/count', {
    responses: {
      '200': {
        description: 'ChatbotCredentials model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(ChatbotCredentials)) where?: Where<ChatbotCredentials>,
  ): Promise<Count> {
    return await this.chatbotCredentialsRepository.count(where);
  }

  @get('/chatbot-credentials', {
    responses: {
      '200': {
        description: 'Array of ChatbotCredentials model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: {'x-ts-type': ChatbotCredentials}},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(ChatbotCredentials)) filter?: Filter<ChatbotCredentials>,
  ): Promise<ChatbotCredentials[]> {
    return await this.chatbotCredentialsRepository.find(filter);
  }

  @patch('/chatbot-credentials', {
    responses: {
      '200': {
        description: 'ChatbotCredentials PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ChatbotCredentials, {partial: true}),
        },
      },
    })
    chatbotCredentials: ChatbotCredentials,
    @param.query.object('where', getWhereSchemaFor(ChatbotCredentials)) where?: Where<ChatbotCredentials>,
  ): Promise<Count> {
    return await this.chatbotCredentialsRepository.updateAll(chatbotCredentials, where);
  }

  @get('/chatbot-credentials/{id}', {
    responses: {
      '200': {
        description: 'ChatbotCredentials model instance',
        content: {'application/json': {schema: {'x-ts-type': ChatbotCredentials}}},
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<ChatbotCredentials> {
    return await this.chatbotCredentialsRepository.findById(id);
  }

  @patch('/chatbot-credentials/{id}', {
    responses: {
      '204': {
        description: 'ChatbotCredentials PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ChatbotCredentials, {partial: true}),
        },
      },
    })
    chatbotCredentials: ChatbotCredentials,
  ): Promise<void> {
    await this.chatbotCredentialsRepository.updateById(id, chatbotCredentials);
  }

  @put('/chatbot-credentials/{id}', {
    responses: {
      '204': {
        description: 'ChatbotCredentials PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() chatbotCredentials: ChatbotCredentials,
  ): Promise<void> {
    await this.chatbotCredentialsRepository.replaceById(id, chatbotCredentials);
  }

  @del('/chatbot-credentials/{id}', {
    responses: {
      '204': {
        description: 'ChatbotCredentials DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.chatbotCredentialsRepository.deleteById(id);
  }
}
