import { DefaultCrudRepository, repository, BelongsToAccessor, HasManyRepositoryFactory} from '@loopback/repository';
import { Definitie, DefinitieRelations, Synoniem} from '../models';
import { MySqldbDataSource } from '../datasources';
import { inject, Getter } from '@loopback/core';
import {SynoniemRepository} from './synoniem.repository';

export class DefinitieRepository extends DefaultCrudRepository<
  Definitie,
  typeof Definitie.prototype.ID,
  DefinitieRelations
  > {

  public readonly synoniems: HasManyRepositoryFactory<Synoniem, typeof Definitie.prototype.ID>;

  constructor(
    @inject('datasources.MySQLDB') dataSource: MySqldbDataSource, @repository.getter('SynoniemRepository') protected synoniemRepositoryGetter: Getter<SynoniemRepository>,
  ) {
    super(Definitie, dataSource);
    this.synoniems = this.createHasManyRepositoryFactoryFor('synoniems', synoniemRepositoryGetter,);
  }
}
