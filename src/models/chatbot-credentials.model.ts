import {Entity, model, property} from '@loopback/repository';

@model({settings: {}})
export class ChatbotCredentials extends Entity {
  @property({
    type: 'number',
    id: true,
  })
  ID?: number;

  @property({
    type: 'string',
    required: true,
  })
  naam: string;

  @property({
    type: 'string',
    required: true,
  })
  APIKey: string;

  @property({
    type: 'string',
    required: true,
  })
  API: string;


  constructor(data?: Partial<ChatbotCredentials>) {
    super(data);
  }
}

export interface ChatbotCredentialsRelations {
  // describe navigational properties here
}

export type ChatbotCredentialsWithRelations = ChatbotCredentials & ChatbotCredentialsRelations;
