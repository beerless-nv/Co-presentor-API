import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getFilterSchemaFor,
  getModelSchemaRef,
  getWhereSchemaFor,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import { inject } from '@loopback/context';
import { Synoniem } from '../models';
import { SynoniemRepository } from '../repositories';
import { PresentatieController, DefinitieController } from '.';
import * as axios from 'axios';

export class SynoniemController {
  constructor(
    @repository(SynoniemRepository)
    public synoniemRepository: SynoniemRepository,
    @inject('controllers.PresentatieController') public presentatieController: PresentatieController,
    @inject('controllers.DefinitieController') public definitieController: DefinitieController,
  ) { }

  @post('/synoniems', {
    responses: {
      '200': {
        description: 'Synoniem model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Synoniem } } },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Synoniem, { exclude: ['ID'] }),
        },
      },
    })
    synoniem: Omit<Synoniem, 'id'>,
  ): Promise<Synoniem> {
    //Add synonym to entity
    await this.addSynonymToEntity(synoniem);

    return await this.synoniemRepository.create(synoniem);
  }

  @get('/synoniems/count', {
    responses: {
      '200': {
        description: 'Synoniem model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Synoniem)) where?: Where<Synoniem>,
  ): Promise<Count> {
    return await this.synoniemRepository.count(where);
  }

  @get('/synoniems', {
    responses: {
      '200': {
        description: 'Array of Synoniem model instances',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': Synoniem } },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Synoniem)) filter?: Filter<Synoniem>,
  ): Promise<Synoniem[]> {
    return await this.synoniemRepository.find(filter);
  }

  @patch('/synoniems', {
    responses: {
      '200': {
        description: 'Synoniem PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Synoniem, { partial: true }),
        },
      },
    })
    synoniem: Synoniem,
    @param.query.object('where', getWhereSchemaFor(Synoniem)) where?: Where<Synoniem>,
  ): Promise<Count> {
    return await this.synoniemRepository.updateAll(synoniem, where);
  }

  @get('/synoniems/{id}', {
    responses: {
      '200': {
        description: 'Synoniem model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Synoniem } } },
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<Synoniem> {
    return await this.synoniemRepository.findById(id);
  }

  @patch('/synoniems/{id}', {
    responses: {
      '204': {
        description: 'Synoniem PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Synoniem, { partial: true }),
        },
      },
    })
    synoniem: Synoniem,
  ): Promise<void> {
    //Get previous synonym
    let previousSynonym = await this.findById(id);

    //Update entity synonym
    this.updateSynonymFromEntity(synoniem, previousSynonym);

    await this.synoniemRepository.updateById(id, synoniem);
  }

  @put('/synoniems/{id}', {
    responses: {
      '204': {
        description: 'Synoniem PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() synoniem: Synoniem,
  ): Promise<void> {
    await this.synoniemRepository.replaceById(id, synoniem);
  }

  @del('/synoniems/{id}', {
    responses: {
      '204': {
        description: 'Synoniem DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    //Remove sysnonym from oswald
    let synoniem = await this.findById(id);
    await this.removeSynonymFromEntity(synoniem);

    await this.synoniemRepository.deleteById(id);
  }

  async addSynonymToEntity(synoniem: Synoniem): Promise<void> {
    //Create entity
    //Declarations
    const chatbotId = '5d2ee9d9dec3e57e85a478ce';
    const baseUri = 'https://admin-api.oswald.ai/api/v1';
    let entityNaam = "";
    let entityLabelId = "";
    let credentials = {
      'email': process.env.OSWALD_USERNAME,
      'password': process.env.OSWALD_PASSWORD,
    };

    if (synoniem.presentatieId !== 0) {
      entityLabelId = '5d4965c03a50663b1d6ab381';

      //Get presentation name
      let presentatie = (await this.presentatieController.findById(synoniem.presentatieId!));
      entityNaam = presentatie.naam;
    }
    else {
      entityLabelId = '5d2eea80dec3e51809a478d5';

      //Get definition name
      let definitie = (await this.definitieController.findById(synoniem.definitieId!));
      entityNaam = definitie.naam;
    }

    //get login access token
    const login = (await axios.default.post(baseUri + '/users/login', credentials))['data'];

    //Get old Oswald Entity
    let oldoptions = {
      'headers': {
        'Content-Type': 'application/json',
      },
      'params': {
        'access_token': login['id'],
      },
    };

    //GET request for old entity
    const entities = (await axios.default.get(baseUri + '/entity-labels/' + entityLabelId + '/values', oldoptions))['data'];
    let updatedEntity = Object();

    entities.forEach((entity: any) => {
      if (entity['value']['nl'] == entityNaam) {
        updatedEntity = entity;
        //Naam veranderen
        updatedEntity['synonyms'].push({ "text": synoniem.naam, "lang": "nl" });
      }
    });

    console.log(updatedEntity);


    //add acces token to options
    let options = {
      'headers': {
        'Content-Type': 'application/json',
      },
      'params': {
        'access_token': login['id'],
      },
    };

    const body = updatedEntity;

    //POST request
    await axios.default.put(baseUri + '/entity-labels/' + entityLabelId + '/values/' + updatedEntity["id"]!, body, options).catch(err => console.log(err));

    //Move to production
    //POST request to retrain chatbot
    const params = {
      'access_token': login['id']
    }
    await axios.default.post(baseUri + '/chatbots/' + chatbotId + '/move-to-production', {}, { params: params }).catch(err => console.log(err));
  }

  async removeSynonymFromEntity(synoniem: Synoniem): Promise<void> {
    //Delete entity
    //Declarations
    const chatbotId = '5d2ee9d9dec3e57e85a478ce';
    const baseUri = 'https://admin-api.oswald.ai/api/v1';
    let entityNaam = "";
    let entityLabelId = "";
    let credentials = {
      'email': process.env.OSWALD_USERNAME,
      'password': process.env.OSWALD_PASSWORD,
    };

    if (synoniem.presentatieId !== 0) {
      entityLabelId = '5d4965c03a50663b1d6ab381';

      //Get presentation name
      let presentatie = (await this.presentatieController.findById(synoniem.presentatieId!));
      entityNaam = presentatie.naam;
    }
    else {
      entityLabelId = '5d2eea80dec3e51809a478d5';

      //Get definition name
      let definitie = (await this.definitieController.findById(synoniem.definitieId!));
      entityNaam = definitie.naam;
    }

    //get login access token
    const login = (await axios.default.post(baseUri + '/users/login', credentials))['data'];

    //Get old Oswald Entity
    let oldoptions = {
      'headers': {
        'Content-Type': 'application/json',
      },
      'params': {
        'access_token': login['id'],
      },
    };

    //GET request for old entity
    const entities = (await axios.default.get(baseUri + '/entity-labels/' + entityLabelId + '/values', oldoptions))['data'];
    let updatedEntity = Object();

    entities.forEach((entity: any) => {
      if (entity['value']['nl'] == entityNaam) {
        updatedEntity = entity;
        //Naam veranderen
        let removeIndex = updatedEntity['synonyms'].findIndex((synonym: any) => {
          return synonym.text === synoniem.naam
        });
        updatedEntity['synonyms'].splice(removeIndex, 1);
      }
    });


    //add acces token to options
    let options = {
      'headers': {
        'Content-Type': 'application/json',
      },
      'params': {
        'access_token': login['id'],
      },
    };

    const body = updatedEntity;

    //POST request
    await axios.default.put(baseUri + '/entity-labels/' + entityLabelId + '/values/' + updatedEntity["id"]!, body, options).catch(err => console.log(err));

    //Move to production
    //POST request to retrain chatbot
    const params = {
      'access_token': login['id']
    }
    await axios.default.post(baseUri + '/chatbots/' + chatbotId + '/move-to-production', {}, { params: params }).catch(err => console.log(err));
  }

  async updateSynonymFromEntity(synoniem: Synoniem, previousSynonym: Synoniem): Promise<void> {


    //Update entity
    //Declarations
    const chatbotId = '5d2ee9d9dec3e57e85a478ce';
    const baseUri = 'https://admin-api.oswald.ai/api/v1';
    let entityNaam = "";
    let entityLabelId = "";
    let credentials = {
      'email': process.env.OSWALD_USERNAME,
      'password': process.env.OSWALD_PASSWORD,
    };

    if (synoniem.presentatieId !== 0) {
      entityLabelId = '5d4965c03a50663b1d6ab381';

      //Get presentation name
      let presentatie = (await this.presentatieController.findById(previousSynonym.presentatieId!));
      entityNaam = presentatie.naam;
    }
    else {
      entityLabelId = '5d2eea80dec3e51809a478d5';

      //Get definition name
      let definitie = (await this.definitieController.findById(previousSynonym.definitieId!));
      entityNaam = definitie.naam;
    }

    //get login access token
    const login = (await axios.default.post(baseUri + '/users/login', credentials))['data'];

    //Get old Oswald Entity
    let oldoptions = {
      'headers': {
        'Content-Type': 'application/json',
      },
      'params': {
        'access_token': login['id'],
      },
    };

    //GET request for old entity
    const entities = (await axios.default.get(baseUri + '/entity-labels/' + entityLabelId + '/values', oldoptions))['data'];
    let updatedEntity = Object();

    entities.forEach((entity: any) => {
      if (entity['value']['nl'] == entityNaam) {
        console.log(previousSynonym);
        console.log(entity);
        updatedEntity = entity;
        //Naam veranderen
        let updateIndex = updatedEntity['synonyms'].findIndex((synonym: any) => {
          return synonym.text === previousSynonym.naam
        });
        updatedEntity['synonyms'][updateIndex] = { "text": synoniem.naam, "lang": "nl" };
      }
    });

    console.log(updatedEntity);

    //add acces token to options
    let options = {
      'headers': {
        'Content-Type': 'application/json',
      },
      'params': {
        'access_token': login['id'],
      },
    };

    const body = updatedEntity;

    //POST request
    await axios.default.put(baseUri + '/entity-labels/' + entityLabelId + '/values/' + updatedEntity["id"]!, body, options).catch(err => console.log(err));

    //Move to production
    //POST request to retrain chatbot
    const params = {
      'access_token': login['id']
    }
    await axios.default.post(baseUri + '/chatbots/' + chatbotId + '/move-to-production', {}, { params: params }).catch(err => console.log(err));
  }
}
