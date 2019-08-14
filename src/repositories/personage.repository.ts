import { DefaultCrudRepository, repository, HasManyRepositoryFactory, BelongsToAccessor } from '@loopback/repository';
import { Personage, PersonageRelations, Animatie } from '../models';
import { MySqldbDataSource } from '../datasources';
import { inject, Getter } from '@loopback/core';
import { AnimatieRepository } from './animatie.repository';

export class PersonageRepository extends DefaultCrudRepository<
  Personage,
  typeof Personage.prototype.ID,
  PersonageRelations
  > {

  public readonly animaties: HasManyRepositoryFactory<Animatie, typeof Personage.prototype.ID>;

  constructor(
    @inject('datasources.MySQLDB') dataSource: MySqldbDataSource, @repository.getter('AnimatieRepository') protected animatieRepositoryGetter: Getter<AnimatieRepository>,
  ) {
    super(Personage, dataSource);
    this.animaties = this.createHasManyRepositoryFactoryFor('animaties', animatieRepositoryGetter);
  }
}
