import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {Presentatie, PresentatieRelations, Slide, Synoniem} from '../models';
import {MySqldbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {SlideRepository} from './slide.repository';
import {SynoniemRepository} from './synoniem.repository';

export class PresentatieRepository extends DefaultCrudRepository<
  Presentatie,
  typeof Presentatie.prototype.ID,
  PresentatieRelations
> {

  public readonly slides: HasManyRepositoryFactory<Slide, typeof Presentatie.prototype.ID>;

  public readonly synoniems: HasManyRepositoryFactory<Synoniem, typeof Presentatie.prototype.ID>;

  constructor(
    @inject('datasources.MySQLDB') dataSource: MySqldbDataSource, @repository.getter('SlideRepository') protected slideRepositoryGetter: Getter<SlideRepository>, @repository.getter('SynoniemRepository') protected synoniemRepositoryGetter: Getter<SynoniemRepository>,
  ) {
    super(Presentatie, dataSource);
    this.synoniems = this.createHasManyRepositoryFactoryFor('synoniems', synoniemRepositoryGetter,);
    this.slides = this.createHasManyRepositoryFactoryFor('slides', slideRepositoryGetter,);
  }
}
