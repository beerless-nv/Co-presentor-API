import {DefaultCrudRepository, repository, HasManyRepositoryFactory, BelongsToAccessor} from '@loopback/repository';
import {Personage, PersonageRelations, Animatie, Categorie} from '../models';
import {MySqldbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {AnimatieRepository} from './animatie.repository';
import {CategorieRepository} from './categorie.repository';

export class PersonageRepository extends DefaultCrudRepository<
  Personage,
  typeof Personage.prototype.ID,
  PersonageRelations
> {

  public readonly animaties: HasManyRepositoryFactory<Animatie, typeof Personage.prototype.ID>;

  public readonly categorie: BelongsToAccessor<Categorie, typeof Personage.prototype.ID>;

  constructor(
    @inject('datasources.MySQLDB') dataSource: MySqldbDataSource, @repository.getter('AnimatieRepository') protected animatieRepositoryGetter: Getter<AnimatieRepository>, @repository.getter('CategorieRepository') protected categorieRepositoryGetter: Getter<CategorieRepository>,
  ) {
    super(Personage, dataSource);
    this.categorie = this.createBelongsToAccessorFor('categorieID', categorieRepositoryGetter,);
    this.animaties = this.createHasManyRepositoryFactoryFor('animaties', animatieRepositoryGetter,);
  }
}
