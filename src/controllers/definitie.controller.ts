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
import { Definitie } from '../models';
import { DefinitieRepository } from '../repositories';
import * as axios from 'axios';
import { filter } from 'minimatch';

export class DefinitieController {
  constructor(
    @repository(DefinitieRepository)
    public definitieRepository: DefinitieRepository,
  ) { }

  @post('/definities', {
    responses: {
      '200': {
        description: 'Definitie model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Definitie } } },
      },
    },
  })
  async create(@requestBody() definitie: Definitie): Promise<Definitie> {

    if (!(await this.find({ where: { naam: definitie.naam } }))) {
      //Create oswald entity
      await this.createDefinitieEntity(definitie.naam);

      //Insert definition into DB
      return await this.definitieRepository.create(definitie);
    }
    else {
      throw {
        code: 400,
        message: "Deze definitie bestaat al",
        name: "DoubleEntityError"
      }
    }
  }

  @get('/definities/count', {
    responses: {
      '200': {
        description: 'Definitie model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Definitie)) where?: Where<Definitie>,
  ): Promise<Count> {
    return await this.definitieRepository.count(where);
  }

  @get('/definities', {
    responses: {
      '200': {
        description: 'Array of Definitie model instances',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': Definitie } },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Definitie)) filter?: Filter<Definitie>,
  ): Promise<Definitie[]> {
    return await this.definitieRepository.find(filter);
  }

  @patch('/definities', {
    responses: {
      '200': {
        description: 'Definitie PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Definitie, { partial: true }),
        },
      },
    })
    definitie: Definitie,
    @param.query.object('where', getWhereSchemaFor(Definitie)) where?: Where<Definitie>,
  ): Promise<Count> {
    return await this.definitieRepository.updateAll(definitie, where);
  }

  @get('/definities/{id}', {
    responses: {
      '200': {
        description: 'Definitie model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Definitie } } },
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<Definitie> {
    return await this.definitieRepository.findById(id);
  }

  @patch('/definities/{id}', {
    responses: {
      '204': {
        description: 'Definitie PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Definitie, { partial: true }),
        },
      },
    })
    definitie: Definitie,
  ): Promise<void> {
    await this.definitieRepository.updateById(id, definitie);
  }

  @put('/definities/{id}', {
    responses: {
      '204': {
        description: 'Definitie PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() definitie: Definitie,
  ): Promise<void> {

    // Update oswald entity
    await this.updateDefinitieEntity(id, definitie);

    // Update database
    await this.definitieRepository.replaceById(id, definitie);
  }

  @del('/definities/{id}', {
    responses: {
      '204': {
        description: 'Definitie DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.definitieRepository.deleteById(id);
  }

  async createDefinitieEntity(naam: string) {

    //Declarations
    const chatbotId = '5d2ee9d9dec3e57e85a478ce';
    const baseUri = 'https://admin-api.oswald.ai/api/v1';
    const entityLabelId = '5d2eea80dec3e51809a478d5';
    let credentials = {
      'email': process.env.OSWALD_USERNAME,
      'password': process.env.OSWALD_PASSWORD,
    };

    //get login access token
    const login = (await axios.default.post(baseUri + '/users/login', credentials))['data'];

    //add acces token to options
    const options = {
      'headers': {
        'Content-Type': 'application/json',
      },
      'params': {
        'access_token': login['id'],
      },
    };

    const body = {
      "value": { 'nl': naam },
      "synonyms": [
        {}
      ],
      "useForCorrections": true,
      "chatbotId": chatbotId,
      "labelId": entityLabelId
    }

    //POST request
    await axios.default.post(baseUri + '/entity-labels/' + entityLabelId + '/values', body, options).catch(err => console.log(err)).then();

    //Move to production
    //POST request to retrain chatbot
    const params = {
      'access_token': login['id']
    }
    await axios.default.post(baseUri + '/chatbots/' + chatbotId + '/move-to-production', {}, { params: params }).catch(err => console.log(err));
  }

  async updateDefinitieEntity(id: number, definitie: Definitie) {
    // Get old presentation name to update oswald entity
    var oudeDefinitie = (await this.definitieRepository.findById(id))

    //Update oswald entity
    //Declarations
    const chatbotId = '5d2ee9d9dec3e57e85a478ce';
    const baseUri = 'https://admin-api.oswald.ai/api/v1';
    const entityLabelId = '5d2eea80dec3e51809a478d5';
    let data = [];
    let value = {};
    let synonyms = [];
    let credentials = {
      'email': process.env.OSWALD_USERNAME,
      'password': process.env.OSWALD_PASSWORD,
    };

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
    var oudeEntity = Object();


    entities.forEach((entity: { value: { nl: string; }; }) => {
      if (entity['value']['nl'] == oudeDefinitie.naam) {
        oudeEntity = entity;
        //Naam veranderen
        oudeEntity['value']['nl'] = definitie.naam;
      }
    });

    console.log(oudeEntity);


    //add acces token to options
    let options = {
      'headers': {
        'Content-Type': 'application/json',
      },
      'params': {
        'access_token': login['id'],
      },
    };

    const body = oudeEntity;

    //POST request
    await axios.default.put(baseUri + '/entity-labels/' + entityLabelId + '/values/' + oudeEntity["id"], body, options).catch(err => console.log(err));

    //Move to production
    //POST request to retrain chatbot
    const params = {
      'access_token': login['id']
    }
    await axios.default.post(baseUri + '/chatbots/' + chatbotId + '/move-to-production', {}, { params: params }).catch(err => console.log(err));
  }

}
