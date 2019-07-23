import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
} from '@loopback/rest';
import {
  Personage,
  Categorie,
} from '../models';
import {PersonageRepository} from '../repositories';

export class PersonageCategorieController {
  constructor(
    @repository(PersonageRepository)
    public personageRepository: PersonageRepository,
  ) { }

  @get('/personages/{id}/categorie', {
    responses: {
      '200': {
        description: 'Categorie belonging to Personage',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': Categorie } },
          },
        },
      },
    },
  })
  async getCategorie(
    @param.path.number('id') id: typeof Personage.prototype.ID,
  ): Promise<Categorie> {
    return await this.personageRepository.categorie(id);
  }
}
