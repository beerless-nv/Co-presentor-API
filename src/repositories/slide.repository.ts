import {DefaultCrudRepository} from '@loopback/repository';
import {Slide, SlideRelations} from '../models';
import {MySqldbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class SlideRepository extends DefaultCrudRepository<
  Slide,
  typeof Slide.prototype.ID,
  SlideRelations
> {
  constructor(
    @inject('datasources.MySQLDB') dataSource: MySqldbDataSource,
  ) {
    super(Slide, dataSource);
  }
}
