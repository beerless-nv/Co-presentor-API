import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
} from '@loopback/rest';
import {
  Definitie,
  Categorie,
} from '../models';
import {DefinitieRepository} from '../repositories';

export class DefinitieCategorieController {
  constructor(
    @repository(DefinitieRepository)
    public definitieRepository: DefinitieRepository,
  ) { }

  @get('/definities/{id}/categorie', {
    responses: {
      '200': {
        description: 'Categorie belonging to Definitie',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': Categorie } },
          },
        },
      },
    },
  })
  async getCategorie(
    @param.path.number('id') id: typeof Definitie.prototype.ID,
  ): Promise<Categorie> {
    return await this.definitieRepository.categorie(id);
  }
}
