import {DefaultCrudRepository} from '@loopback/repository';
import {TtsInstellingen, TtsInstellingenRelations} from '../models';
import {MySqldbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class TtsInstellingenRepository extends DefaultCrudRepository<TtsInstellingen,
  typeof TtsInstellingen.prototype.ID,
  TtsInstellingenRelations> {
  constructor(
    @inject('datasources.MySQLDB') dataSource: MySqldbDataSource,
  ) {
    super(TtsInstellingen, dataSource);
  }
}
