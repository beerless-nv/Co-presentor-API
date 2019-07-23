import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
} from '@loopback/rest';
import {
  PresentatiePersonage,
  Presentatie,
} from '../models';
import {PresentatiePersonageRepository} from '../repositories';

export class PresentatiePersonagePresentatieController {
  constructor(
    @repository(PresentatiePersonageRepository)
    public presentatiePersonageRepository: PresentatiePersonageRepository,
  ) { }

  @get('/presentatie-personages/{id}/presentatie', {
    responses: {
      '200': {
        description: 'Presentatie belonging to PresentatiePersonage',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': Presentatie } },
          },
        },
      },
    },
  })
  async getPresentatie(
    @param.path.number('id') id: typeof PresentatiePersonage.prototype.ID,
  ): Promise<Presentatie> {
    return await this.presentatiePersonageRepository.presentatie(id);
  }
}
