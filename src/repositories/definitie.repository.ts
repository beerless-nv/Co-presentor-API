import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {Definitie, DefinitieRelations, Categorie} from '../models';
import {MySqldbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {CategorieRepository} from './categorie.repository';

export class DefinitieRepository extends DefaultCrudRepository<
  Definitie,
  typeof Definitie.prototype.ID,
  DefinitieRelations
> {

  public readonly categorie: BelongsToAccessor<Categorie, typeof Definitie.prototype.ID>;

  constructor(
    @inject('datasources.MySQLDB') dataSource: MySqldbDataSource, @repository.getter('CategorieRepository') protected categorieRepositoryGetter: Getter<CategorieRepository>,
  ) {
    super(Definitie, dataSource);
    this.categorie = this.createBelongsToAccessorFor('categorieID', categorieRepositoryGetter,);
  }
}
