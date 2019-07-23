import {DefaultCrudRepository} from '@loopback/repository';
import {Animatie, AnimatieRelations} from '../models';
import {MySqldbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class AnimatieRepository extends DefaultCrudRepository<
  Animatie,
  typeof Animatie.prototype.ID,
  AnimatieRelations
> {
  constructor(
    @inject('datasources.MySQLDB') dataSource: MySqldbDataSource,
  ) {
    super(Animatie, dataSource);
  }
}
