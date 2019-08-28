import { DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import { User, UserRelations, RegistrationToken} from '../models';
import { MySqldbDataSource } from '../datasources';
import { inject, Getter} from '@loopback/core';
import {RegistrationTokenRepository} from './registration-token.repository';

export type Credentials = {
  email: string;
  password: string;
};

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.ID,
  UserRelations
  > {

  public readonly registrationTokens: HasManyRepositoryFactory<RegistrationToken, typeof User.prototype.ID>;

  constructor(
    @inject('datasources.MySQLDB') dataSource: MySqldbDataSource, @repository.getter('RegistrationTokenRepository') protected registrationTokenRepositoryGetter: Getter<RegistrationTokenRepository>,
  ) {
    super(User, dataSource);
    this.registrationTokens = this.createHasManyRepositoryFactoryFor('registrationTokens', registrationTokenRepositoryGetter,);
  }
}
