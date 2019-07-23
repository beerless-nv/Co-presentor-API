import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {PresentatiePersonage, PresentatiePersonageRelations, Presentatie, Personage} from '../models';
import {MySqldbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {PresentatieRepository} from './presentatie.repository';
import {PersonageRepository} from './personage.repository';

export class PresentatiePersonageRepository extends DefaultCrudRepository<
  PresentatiePersonage,
  typeof PresentatiePersonage.prototype.ID,
  PresentatiePersonageRelations
> {

  public readonly presentatie: BelongsToAccessor<Presentatie, typeof PresentatiePersonage.prototype.ID>;

  public readonly personage: BelongsToAccessor<Personage, typeof PresentatiePersonage.prototype.ID>;

  constructor(
    @inject('datasources.MySQLDB') dataSource: MySqldbDataSource, @repository.getter('PresentatieRepository') protected presentatieRepositoryGetter: Getter<PresentatieRepository>, @repository.getter('PersonageRepository') protected personageRepositoryGetter: Getter<PersonageRepository>,
  ) {
    super(PresentatiePersonage, dataSource);
    this.personage = this.createBelongsToAccessorFor('personageID', personageRepositoryGetter,);
    this.presentatie = this.createBelongsToAccessorFor('presentatieID', presentatieRepositoryGetter,);
  }
}
