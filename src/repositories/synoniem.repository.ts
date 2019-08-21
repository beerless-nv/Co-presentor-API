import { DefaultCrudRepository } from '@loopback/repository';
import { Synoniem, SynoniemRelations } from '../models';
import { MySqldbDataSource } from '../datasources';
import { inject } from '@loopback/core';

export class SynoniemRepository extends DefaultCrudRepository<
  Synoniem,
  typeof Synoniem.prototype.ID,
  SynoniemRelations
  > {
  constructor(
    @inject('datasources.MySQLDB') dataSource: MySqldbDataSource,
  ) {
    super(Synoniem, dataSource);
  }
}
