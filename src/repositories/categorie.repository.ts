import {DefaultCrudRepository} from '@loopback/repository';
import {Categorie, CategorieRelations} from '../models';
import {MySqldbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class CategorieRepository extends DefaultCrudRepository<
  Categorie,
  typeof Categorie.prototype.ID,
  CategorieRelations
> {
  constructor(
    @inject('datasources.MySQLDB') dataSource: MySqldbDataSource,
  ) {
    super(Categorie, dataSource);
  }
}
