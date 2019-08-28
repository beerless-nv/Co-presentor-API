import { DefaultCrudRepository } from '@loopback/repository';
import { RegistrationToken, RegistrationTokenRelations } from '../models';
import { MySqldbDataSource } from '../datasources';
import { inject } from '@loopback/core';

export class RegistrationTokenRepository extends DefaultCrudRepository<
  RegistrationToken,
  typeof RegistrationToken.prototype.ID,
  RegistrationTokenRelations
  > {
  constructor(
    @inject('datasources.MySQLDB') dataSource: MySqldbDataSource,
  ) {
    super(RegistrationToken, dataSource);
  }
}
