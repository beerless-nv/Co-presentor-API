import {inject} from '@loopback/core';
import {juggler} from '@loopback/repository';
import * as config from './my-sqldb.datasource.json';

export class MySqldbDataSource extends juggler.DataSource {
  static dataSourceName = 'MySQLDB';

  constructor(
    @inject('datasources.config.MySQLDB', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
