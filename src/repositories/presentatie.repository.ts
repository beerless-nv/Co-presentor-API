import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {Presentatie, PresentatieRelations, Slide, Synoniem, ZwevendeTekst} from '../models';
import {MySqldbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {SlideRepository} from './slide.repository';
import {SynoniemRepository} from './synoniem.repository';
import {ZwevendeTekstRepository} from './zwevende-tekst.repository';

export class PresentatieRepository extends DefaultCrudRepository<
  Presentatie,
  typeof Presentatie.prototype.ID,
  PresentatieRelations
> {

  public readonly slides: HasManyRepositoryFactory<Slide, typeof Presentatie.prototype.ID>;

  public readonly synoniems: HasManyRepositoryFactory<Synoniem, typeof Presentatie.prototype.ID>;

  public readonly zwevendeTeksts: HasManyRepositoryFactory<ZwevendeTekst, typeof Presentatie.prototype.ID>;

  constructor(
    @inject('datasources.MySQLDB') dataSource: MySqldbDataSource, @repository.getter('SlideRepository') protected slideRepositoryGetter: Getter<SlideRepository>, @repository.getter('SynoniemRepository') protected synoniemRepositoryGetter: Getter<SynoniemRepository>, @repository.getter('ZwevendeTekstRepository') protected zwevendeTekstRepositoryGetter: Getter<ZwevendeTekstRepository>,
  ) {
    super(Presentatie, dataSource);
    this.zwevendeTeksts = this.createHasManyRepositoryFactoryFor('zwevendeTeksts', zwevendeTekstRepositoryGetter,);
    this.synoniems = this.createHasManyRepositoryFactoryFor('synoniems', synoniemRepositoryGetter,);
    this.slides = this.createHasManyRepositoryFactoryFor('slides', slideRepositoryGetter,);
  }
}
