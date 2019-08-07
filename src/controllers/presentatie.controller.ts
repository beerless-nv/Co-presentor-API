import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
  model,
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
  RestBindings,
  Request,
  Response,
} from '@loopback/rest';
import { inject } from '@loopback/context';
import * as multer from 'multer';
import * as path from 'path';
import { Presentatie, Slide } from '../models';
import { PresentatieRepository } from '../repositories';
import * as fs from 'fs';
import { Http2SecureServer } from 'http2';
import MulterGoogleCloudStorage from 'multer-google-storage';
import { PresentatieSlideController } from '.';


export class PresentatieController {
  constructor(
    @repository(PresentatieRepository)
    public presentatieRepository: PresentatieRepository,
    @inject('controllers.PresentatieSlideController') public presentatieSlideController: PresentatieSlideController,
  ) { }

  @post('/presentaties', {
    responses: {
      '200': {
        description: 'Presentatie model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Presentatie } } },
      },
    },
  })
  async create(@requestBody() presentatie: Presentatie): Promise<Presentatie> {
    return await this.presentatieRepository.create(presentatie);
  }

  @get('/presentaties/count', {
    responses: {
      '200': {
        description: 'Presentatie model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Presentatie)) where?: Where<Presentatie>,
  ): Promise<Count> {
    return await this.presentatieRepository.count(where);
  }

  @get('/presentaties', {
    responses: {
      '200': {
        description: 'Array of Presentatie model instances',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': Presentatie } },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Presentatie)) filter?: Filter<Presentatie>,
  ): Promise<Presentatie[]> {
    return await this.presentatieRepository.find(filter);
  }

  @patch('/presentaties', {
    responses: {
      '200': {
        description: 'Presentatie PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Presentatie, { partial: true }),
        },
      },
    })
    presentatie: Presentatie,
    @param.query.object('where', getWhereSchemaFor(Presentatie)) where?: Where<Presentatie>,
  ): Promise<Count> {
    return await this.presentatieRepository.updateAll(presentatie, where);
  }

  @get('/presentaties/{id}', {
    responses: {
      '200': {
        description: 'Presentatie model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Presentatie } } },
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<Presentatie> {
    return await this.presentatieRepository.findById(id);
  }

  @patch('/presentaties/{id}', {
    responses: {
      '204': {
        description: 'Presentatie PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Presentatie, { partial: true }),
        },
      },
    })
    presentatie: Presentatie,
  ): Promise<void> {
    await this.presentatieRepository.updateById(id, presentatie);
  }

  @put('/presentaties/{id}', {
    responses: {
      '204': {
        description: 'Presentatie PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() presentatie: Presentatie,
  ): Promise<void> {
    await this.presentatieRepository.replaceById(id, presentatie);
  }

  @del('/presentaties/{id}', {
    responses: {
      '204': {
        description: 'Presentatie DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.presentatieRepository.deleteById(id);
  }

  // Methoed for converting PPTX to JPG
  async convertPPTx(files: any) {
    // Declarations for conversion
    var fs = require('fs');
    var cloudconvert = new (require('cloudconvert'))('OXWbTMAmmF6scVU7qbRKRjXWc6vDrqCCn4bVjRInM3CZudFadqYIMB0dav1Ab47q');
    var rawData = fs.readFileSync(process.env.GCS_KEYFILE)
    var keyfile = JSON.parse(rawData);
    var filename = files[0].originalname;
    var foldername = filename.replace(".pptx", "");
    var slideUrl = new Array<String>();


    // Convert PPTX(base64 string) to JPG
    cloudconvert.convert({
      "apikey": "OXWbTMAmmF6scVU7qbRKRjXWc6vDrqCCn4bVjRInM3CZudFadqYIMB0dav1Ab47q",
      "inputformat": "pptx",
      "outputformat": "jpg",
      "input": "base64",
      "file": files[0].buffer.toString("base64"),
      "filename": filename,
      "output": {
        "googlecloud": {
          "projectid": process.env.GCLOUD_PROJECT,
          "bucket": process.env.GCS_BUCKET,
          "credentials": keyfile,
          "path": foldername
        }
      }
    }, async (request: any, err: any) => {

      // Get filenames of slide images
      slideUrl = err.data.output.files;

      // Create new presentation and slide objects
      var presentatie = new Presentatie();
      var teller = 1;
      presentatie.naam = foldername;
      presentatie.url = foldername;
      console.log(slideUrl);

      // Get new ID of created presentation
      var presentatieId = (await this.create(presentatie)).ID

      // Create slides for presentatie
      slideUrl.forEach(url => {
        var slide = new Slide();
        slide.afbeelding = url.toString();
        slide.volgnummer = teller;
        slide.presentatieID = presentatieId;
        this.presentatieSlideController.create(presentatieId, slide);
        teller++;
      });
    });
  }


  // Upload new presentation router
  @post('/uploadPresentatie', {
    responses: {
      200: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
        description: '',
      },
    },
  })
  // Method to upload presentation
  async uploadPresentatie(
    @requestBody({
      description: 'multipart/form-data value.',
      required: true,
      content: {
        'multipart/form-data': {
          // Skip body parsing
          'x-parser': 'stream',
          schema: { type: 'object' },
        },
      },
    })
    request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<object> {
    // Storing pptx in multer memory
    const storage = multer.memoryStorage();
    const upload = multer({ storage });
    return new Promise<object>((resolve, reject) => {
      upload.any()(request, response, err => {
        if (err) return reject(err);

        // Converting memory stored pptx
        this.convertPPTx(request.files);
        resolve({
          files: request.file,
          fields: (request as any).fields,
        });
      });
    });
  }
}
