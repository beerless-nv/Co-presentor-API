import { DefaultCrudRepository } from '@loopback/repository';
import { ZwevendeTekst, ZwevendeTekstRelations } from '../models';
import { MySqldbDataSource } from '../datasources';
import { inject } from '@loopback/core';

export class ZwevendeTekstRepository extends DefaultCrudRepository<
  ZwevendeTekst,
  typeof ZwevendeTekst.prototype.ID,
  ZwevendeTekstRelations
  > {
  constructor(
    @inject('datasources.MySQLDB') dataSource: MySqldbDataSource,
  ) {
    super(ZwevendeTekst, dataSource);
  }
}
