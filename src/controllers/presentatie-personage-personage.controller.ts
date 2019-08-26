import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
} from '@loopback/rest';
import {
  PresentatiePersonage,
  Personage,
} from '../models';
import { PresentatiePersonageRepository } from '../repositories';
import { authenticate } from '@loopback/authentication';

export class PresentatiePersonagePersonageController {
  constructor(
    @repository(PresentatiePersonageRepository)
    public presentatiePersonageRepository: PresentatiePersonageRepository,
  ) { }

  @get('/presentatie-personages/{id}/personage', {
    responses: {
      '200': {
        description: 'Personage belonging to PresentatiePersonage',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': Personage } },
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async getPersonage(
    @param.path.number('id') id: typeof PresentatiePersonage.prototype.ID,
  ): Promise<Personage> {
    return await this.presentatiePersonageRepository.personage(id);
  }
}
