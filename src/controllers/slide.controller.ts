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
  HttpErrors,
} from '@loopback/rest';
import { Slide, SlideRelations, Presentatie } from '../models';
import { inject } from '@loopback/context';
import { SlideRepository } from '../repositories';
import * as GoogleCloudStorage from '@google-cloud/storage';
import { resolve } from 'path';
import { PresentatieController } from '.';
import { Application } from '@loopback/core';
import * as multer from 'multer';
import { runInNewContext } from 'vm';
import { Server, request } from 'https';
import { authenticate } from '@loopback/authentication';

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
  @authenticate('jwt')
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
  @authenticate('jwt')
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
  @authenticate('jwt')
  async find(
    @param.query.object('filter', getFilterSchemaFor(Slide)) filter?: Filter<Slide>,
  ): Promise<Array<any>> {

    var slides = (await this.slideRepository.find(filter));
    var slideUrls = new Array<any>();

    var arrayLength = slides.length;

    for (var i = 0; i < arrayLength; i++) {
      var url = (await this.getSlideImage(slides[i].afbeelding!, slides[i].presentatieID!));
      if (slides[i].video) {
        let video = (await this.getSlideVideo(slides[i]));
        slideUrls.push(
          {
            slide: slides[i],
            url: url,
            video: video
          });
      }
      else {
        slideUrls.push(
          {
            slide: slides[i],
            url: url,
            video: null
          });
      }
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
  @authenticate('jwt')
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

    let slide = (await this.slideRepository.findById(id));
    let url = (await this.getSlideImage(slide.afbeelding!, slide.presentatieID!));
    let video: any;
    let slideUrl: object;
    if (slide.video) {
      video = (await this.getSlideVideo(slide));
      slideUrl = {
        slide: slide,
        url: url,
        video: video
      }
    }
    else {
      slideUrl = {
        slide: slide,
        url: url,
        video: null
      }
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
  @authenticate('jwt')
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
  @authenticate('jwt')
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
    var filepath = '/' + presentatie.url + '/old/' + filename;
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

  async getSlideVideo(slide: Slide): Promise<string> {
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

    // Get File
    var filepath = 'video/' + slide.video;
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

  // Upload slide video router
  @post('/uploadVideo/{id}', {
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
  @authenticate('jwt')
  // Function to upload Video
  async uploadVideo(
    @requestBody({
      description: 'multipart/form-data value.',
      required: true,
      content: {
        'multipart/form-data': {
          // Skip body parsing
          'x-parser': 'stream',
          schema: { type: 'object' },
        }
      },
    })
    req: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response,
    @param.path.number('id') id: number,
  ): Promise<any> {
    console.log('voor declaraties');
    // Storage declarations
    const storage = new GoogleCloudStorage({
      projectId: process.env.GCLOUD_PROJECT,
      keyFilename: process.env.GCS_KEYFILE,
    });
    const upload = multer({
      storage: multer.memoryStorage()
    });
    const bucket = await storage.bucket(process.env.GCS_BUCKET!);

    console.log("voor remove slide video");
    // Delete previous video
    await this.removeSlideVideo(id);

    // Get slide object
    let slideObject: any = await this.findById(id);
    let slide = slideObject['slide'];
    let naam = slide.naam;

    console.log("voor upload");
    // Initiating upload
    return new Promise<object>((resolve, reject) => {
      upload.single('file')(req, response, async err => {

        if (err) {
          // A Multer error occurred when uploading.
          return reject(err);
        }
        console.log('begin upload');
        console.log(req.file);
        if (!req.file) {
          throw new HttpErrors[400]('Geen bestand geüpload!');
        }

        //Get Slide object
        this.findById(id).then(async (slideObject: any) => {
          console.log(slideObject);
          let slide = slideObject['slide'];
          this.presentatieController.findById(slide.presentatieID).then(async (presentatie: Presentatie) => {
            slide.video = presentatie.naam + '/' + slide.volgnummer + '/' + req.file.originalname;
            await this.updateById(id, slide);
            const blob = bucket.file("video/" + presentatie.naam + '/' + slide.volgnummer + '/' + req.file.originalname)
            console.log(slide);

            // Blob declaration
            const blobStream = blob.createWriteStream({
              resumable: false,
            });

            console.log("voor on error");
            // Stream error
            await blobStream.on('error', err => {
              throw err;
            });

            console.log("voor on finish");
            // Stream succes
            await blobStream.on('finish', async () => {
              const publicUrl = "https://storage.googleapis.com/" + bucket.name + "/" + blob.name;
            });

            console.log("voor blobstream end");
            // Closing stream
            await blobStream.end(req.file.buffer);

            resolve({
              files: req.file,
              fields: (req as any).fields,
            });
            return "test";
          });
        })
      });
    });
  }

  @del('/deleteVideo/{id}', {
    responses: {
      '204': {
        description: 'Slide DELETE success',
      },
    },
  })
  @authenticate('jwt')
  async removeSlideVideo(@param.path.number('id') id: number): Promise<any> {
    console.log("STart REMOVE");
    // Get slide object
    let slideObject: any = await this.findById(id);
    let slide: Slide = slideObject['slide'];

    // Get other slides
    let slides = await this.find({ where: { video: slide.video } });

    if (slide.video) {
      if (slides.length === 1) {
        // Declaration Google Cloud Storage
        const GOOGLE_CLOUD_PROJECT_ID = process.env.GCLOUD_PROJECT;
        const GOOGLE_CLOUD_KEYFILE = process.env.GCS_KEYFILE;
        const BUCKETNAME = process.env.GCS_BUCKET;

        const storage = new GoogleCloudStorage({
          projectId: GOOGLE_CLOUD_PROJECT_ID,
          keyFilename: GOOGLE_CLOUD_KEYFILE,
        });

        // Get bucket
        const bucket = storage.bucket(BUCKETNAME!);

        // Delete file
        if (await bucket.file('video/' + slide.video)) {
          await bucket.file("video/" + slide.video).delete();
        }
      }

      // Update database
      slide.video = undefined;
      let result = await this.updateById(id, slide);

      console.log("Voor return result")
      // Return result
      return result
    }
    else {
      console.log("Return in else")
      return;
    }
  }
}
