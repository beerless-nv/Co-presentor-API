import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {Presentatie, PresentatieRelations, Slide} from '../models';
import {MySqldbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {SlideRepository} from './slide.repository';

export class PresentatieRepository extends DefaultCrudRepository<
  Presentatie,
  typeof Presentatie.prototype.ID,
  PresentatieRelations
> {

  public readonly slides: HasManyRepositoryFactory<Slide, typeof Presentatie.prototype.ID>;

  constructor(
    @inject('datasources.MySQLDB') dataSource: MySqldbDataSource, @repository.getter('SlideRepository') protected slideRepositoryGetter: Getter<SlideRepository>,
  ) {
    super(Presentatie, dataSource);
    this.slides = this.createHasManyRepositoryFactoryFor('slides', slideRepositoryGetter,);
  }
}
