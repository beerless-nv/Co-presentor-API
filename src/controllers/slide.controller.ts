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
  RestBindings,
  requestBody,
  Request,
  Response,
} from '@loopback/rest';
import { Slide, SlideRelations } from '../models';
import { inject } from '@loopback/context';
import { SlideRepository } from '../repositories';
import * as GoogleCloudStorage from '@google-cloud/storage';
import { resolve } from 'path';
import { PresentatieController } from '.';
import { Application } from '@loopback/core';
import * as multer from 'multer';


export class SlideController {
  constructor(
    @repository(SlideRepository)
    public slideRepository: SlideRepository,
    @inject('controllers.PresentatieController') public presentatieController: PresentatieController,
  ) { }

  @post('/slides', {
    responses: {
      '200': {
        description: 'Slide model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Slide } } },
      },
    },
  })
  async create(@requestBody() slide: Slide): Promise<Slide> {
    return await this.slideRepository.create(slide);
  }

  @get('/slides/count', {
    responses: {
      '200': {
        description: 'Slide model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Slide)) where?: Where<Slide>,
  ): Promise<Count> {
    return await this.slideRepository.count(where);
  }

  @get('/slides', {
    responses: {
      '200': {
        description: 'Array of Slide model instances',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': Slide } },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Slide)) filter?: Filter<Slide>,
  ): Promise<Array<any>> {

    var slides = (await this.slideRepository.find(filter));
    var slideUrls = new Array<any>();

    var arrayLength = slides.length;

    for (var i = 0; i < arrayLength; i++) {
      var url = (await this.getSlideImage(slides[i].afbeelding!, slides[i].presentatieID!));
      slideUrls.push(
        {
          slide: slides[i],
          url: url
        });
    }

    return slideUrls;
  }

  @patch('/slides', {
    responses: {
      '200': {
        description: 'Slide PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Slide, { partial: true }),
        },
      },
    })
    slide: Slide,
    @param.query.object('where', getWhereSchemaFor(Slide)) where?: Where<Slide>,
  ): Promise<Count> {
    return await this.slideRepository.updateAll(slide, where);
  }

  @get('/slides/{id}', {
    responses: {
      '200': {
        description: 'Slide model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Slide } } },
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<Object> {

    var slide = (await this.slideRepository.findById(id));
    var url = (await this.getSlideImage(slide.afbeelding!, slide.presentatieID!));

    var slideUrl = {
      slide: slide,
      url: url
    }

    return slideUrl;

  }

  @patch('/slides/{id}', {
    responses: {
      '204': {
        description: 'Slide PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Slide, { partial: true }),
        },
      },
    })
    slide: Slide,
  ): Promise<void> {
    await this.slideRepository.updateById(id, slide);
  }

  @put('/slides/{id}', {
    responses: {
      '204': {
        description: 'Slide PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() slide: Slide,
  ): Promise<void> {
    await this.slideRepository.replaceById(id, slide);
  }

  @del('/slides/{id}', {
    responses: {
      '204': {
        description: 'Slide DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.slideRepository.deleteById(id);
  }

  async getSlideImage(filename: string, presentatieId: number): Promise<string> {
    // Declaration
    const GOOGLE_CLOUD_PROJECT_ID = process.env.GCLOUD_PROJECT;
    const GOOGLE_CLOUD_KEYFILE = process.env.GCS_KEYFILE;
    const BUCKETNAME = process.env.GCS_BUCKET;

    const storage = new GoogleCloudStorage({
      projectId: GOOGLE_CLOUD_PROJECT_ID,
      keyFilename: GOOGLE_CLOUD_KEYFILE,
    });

    // Get bucket
    const bucket = storage.bucket(BUCKETNAME!);

    // Get presentation name
    var presentatie = await this.presentatieController.findById(presentatieId)


    // Get File
    var filepath = '/' + presentatie.url + '/' + filename;
    var file = bucket.file(filepath);
    var datum = new Date()
    datum.setDate(datum.getDate() + 1);

    // Create config for signed url
    var config = {
      action: 'read',
      expires: datum,
    }

    // get signed url
    return (await file.getSignedUrl(config))[0];
  }

  // // Upload slide video router
  // @post('/uploadVideo/{id}/{naam}', {
  //   responses: {
  //     200: {
  //       content: {
  //         'application/json': {
  //           schema: {
  //             type: 'object',
  //           },
  //         },
  //       },
  //       description: '',
  //     },
  //   },
  // })
  // // Function to upload Video
  // async uploadVideo(
  //   @requestBody({
  //     description: 'multipart/form-data value.',
  //     required: true,
  //     content: {
  //       'multipart/form-data': {
  //         // Skip body parsing
  //         'x-parser': 'stream',
  //         schema: { type: 'object' },
  //       }
  //     },
  //   })
  //   request: Request,
  //   @inject(RestBindings.Http.RESPONSE) response: Response,
  //   @param.path.number('id') id: number,
  //   @param.path.string('naam') naam: string
  // ): Promise<object> {
  //   return {};
  // }

  // async sendUploadToGCS(req: any, res: any, next: any) {
  //   if (!req.file) {
  //     return next();
  //   }

  //   const gcsname = Date.now() + req.file.originalname;
  //   const file = bucket.file(gcsname);

  //   const stream = file.createWriteStream({
  //     metadata: {
  //       contentType: req.file.mimetype
  //     },
  //     resumable: false
  //   });

  //   stream.on('error', (err) => {
  //     req.file.cloudStorageError = err;
  //     next(err);
  //   });

  //   stream.on('finish', () => {
  //     req.file.cloudStorageObject = gcsname;
  //     file.makePublic().then(() => {
  //       req.file.cloudStoragePublicUrl = getPublicUrl(gcsname);
  //       next();
  //     });
  //   });

  //   stream.end(req.file.buffer);
  // }

  // async getPublicUrl(filename: any) {
  //   return `https://storage.googleapis.com/${CLOUD_BUCKET}/${filename}`;
  // }
}
