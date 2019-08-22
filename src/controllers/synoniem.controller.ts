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
    await this.synoniemRepository.deleteById(id);
  }

  @post('/updateSynoniemen', {
    responses: {
      '200': {
        description: 'Synoniem model instance',
      },
    },
  })
  async updateSynoniemen(
    @requestBody()
    data: any,
  ): Promise<any> {
    // Check if presentation or definition
    if (data.presentatieId != 0) {
      // Delete all existing synoniemen
      let oudeSynoniemen = await this.find({
        where: {
          presentatieId: data.presentatieId
        }
      });

      if (oudeSynoniemen) {
        oudeSynoniemen.forEach(synoniem => {
          this.deleteById(synoniem.ID!);
        });
      }

      // Create all new synonyms
      data.synoniemen.forEach((synoniem: Pick<Synoniem, "ID" | "naam" | "presentatieId" | "definitieId" | "getId" | "getIdObject" | "toJSON" | "toObject">) => {
        this.create(synoniem);
      });

      // Update Oswald entity
      return await this.updateEntities(data.synoniemen, data.presentatieId, data.definitieId);
    }
    else {
      // Delete all existing synoniemen
      let oudeSynoniemen = await this.find({
        where: {
          definitieId: data.definitieId
        }
      });

      if (oudeSynoniemen) {
        oudeSynoniemen.forEach(synoniem => {
          this.deleteById(synoniem.ID!);
        });
      }

      // Create all new synonyms
      data.synoniemen.forEach((synoniem: Pick<Synoniem, "ID" | "naam" | "presentatieId" | "definitieId" | "getId" | "getIdObject" | "toJSON" | "toObject">) => {
        this.create(synoniem);
      });

      // Update Oswald entity
      return await this.updateEntities(data.synoniemen, data.presentatieId, data.definitieId);
    }
  }

  async updateEntities(synoniemen: Array<Synoniem>, presentatieId: number, definitieId: number): Promise<void> {
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

    if (presentatieId !== 0) {
      entityLabelId = '5d4965c03a50663b1d6ab381';

      //Get presentation name
      let presentatie = (await this.presentatieController.findById(presentatieId!));
      entityNaam = presentatie.naam;
    }
    else {
      entityLabelId = '5d2eea80dec3e51809a478d5';

      //Get definition name
      let definitie = (await this.definitieController.findById(definitieId!));
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
    let synonyms = Array<Object>();
    synoniemen.forEach(synoniem => {
      synonyms.push({ "text": synoniem.naam, "lang": "nl" })
    });
    let updatedEntity = Object();

    entities.forEach((entity: any) => {
      if (entity['value']['nl'] == entityNaam) {
        //Change synonyms
        entity['synonyms'] = synonyms;

        //Change entity
        updatedEntity = entity;
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
}
