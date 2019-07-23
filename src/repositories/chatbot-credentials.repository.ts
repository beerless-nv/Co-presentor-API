import {DefaultCrudRepository} from '@loopback/repository';
import {ChatbotCredentials, ChatbotCredentialsRelations} from '../models';
import {MySqldbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class ChatbotCredentialsRepository extends DefaultCrudRepository<
  ChatbotCredentials,
  typeof ChatbotCredentials.prototype.ID,
  ChatbotCredentialsRelations
> {
  constructor(
    @inject('datasources.MySQLDB') dataSource: MySqldbDataSource,
  ) {
    super(ChatbotCredentials, dataSource);
  }
}
