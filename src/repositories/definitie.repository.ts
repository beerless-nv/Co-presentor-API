import { DefaultCrudRepository, repository, BelongsToAccessor } from '@loopback/repository';
import { Definitie, DefinitieRelations } from '../models';
import { MySqldbDataSource } from '../datasources';
import { inject, Getter } from '@loopback/core';

export class DefinitieRepository extends DefaultCrudRepository<
  Definitie,
  typeof Definitie.prototype.ID,
  DefinitieRelations
  > {

  constructor(
    @inject('datasources.MySQLDB') dataSource: MySqldbDataSource,
  ) {
    super(Definitie, dataSource);
  }
}
