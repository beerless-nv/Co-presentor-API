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
  RestBindings,
  Request,
  Response,
  HttpErrors,
} from '@loopback/rest';
import { inject } from '@loopback/context';
import * as multer from 'multer';
import * as path from 'path';
import { Presentatie, Slide, ZwevendeTekst } from '../models';
import { PresentatieRepository } from '../repositories';
import { PresentatieSlideController, PresentatieZwevendeTekstController } from '.';
import * as GoogleCloudStorage from '@google-cloud/storage';
import * as axios from 'axios';
import { authenticate } from '@loopback/authentication'
import * as imageHash from 'image-hash';
import { resolve } from 'dns';


export class PresentatieController {
  constructor(
    @repository(PresentatieRepository)
    public presentatieRepository: PresentatieRepository,
    @inject('controllers.PresentatieSlideController') public presentatieSlideController: PresentatieSlideController,
    @inject('controllers.PresentatieZwevendeTekstController') public presentatieZwevendeTekstController: PresentatieZwevendeTekstController,
  ) { }

  @post('/presentaties', {
    responses: {
      '200': {
        description: 'Presentatie model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Presentatie } } },
      },
    },
  })
  @authenticate('jwt')
  async create(@requestBody() presentatie: Presentatie): Promise<Presentatie> {
    if ((await this.find({ where: { naam: presentatie.naam } })).length == 0) {
      //Create oswald entity
      await this.createPresentatieEntity(presentatie.naam);

      //Set presentation URL
      presentatie.url = presentatie.naam;

      //Insert definition into DB
      return await this.presentatieRepository.create(presentatie);
    }
    else {
      throw new HttpErrors[422]('Een presentatie met deze naam bestaat al!');
    }
  }

  @get('/presentaties/count', {
    responses: {
      '200': {
        description: 'Presentatie model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  @authenticate('jwt')
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
  @authenticate('jwt')
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
  @authenticate('jwt')
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
  @authenticate('jwt')
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
  @authenticate('jwt')
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

    var databankPresentatie = (await this.find({ where: { naam: presentatie.naam } }));

    if (presentatie.naam != null && databankPresentatie.length != 0 && databankPresentatie[0].ID != id) {
      throw new HttpErrors[422]('Een presentatie met deze naam bestaat al!');
    }
    else {
      //Create oswald entity
      if (presentatie.naam != undefined) {
        await this.updatePresentatieEntity(id, presentatie);
      }

      //Insert definition into DB
      return await this.presentatieRepository.updateById(id, presentatie);
    }
  }

  @patch('/presentaties/bulk', {
    responses: {
      '204': {
        description: 'Presentatie PATCH success',
      },
    },
  })
  @authenticate('jwt')
  async updateBulk(
    @requestBody({
      content: {
        'application/json': {},
      },
    })
    presentaties: Array<Presentatie>,
  ): Promise<void> {
    presentaties.map(async presentatie => {
      const databankPresentatie = (await this.find({ where: { naam: presentatie.naam } }));

      if (presentatie.naam != null && databankPresentatie.length != 0 && databankPresentatie[0].ID != presentatie.ID) {
        throw new HttpErrors[422]('Een presentatie met deze naam bestaat al!');
      }
      else {
        //Insert definition into DB
        return await this.presentatieRepository.updateById(presentatie.ID, presentatie);
      }
    });

    await this.updatePresentatiesEntities(presentaties);
  }

  @put('/presentaties/{id}', {
    responses: {
      '204': {
        description: 'Presentatie PUT success',
      },
    },
  })
  @authenticate('jwt')
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() presentatie: Presentatie,
  ): Promise<void> {
    return await this.presentatieRepository.replaceById(id, presentatie);
  }

  @del('/presentaties/{id}', {
    responses: {
      '204': {
        description: 'Presentatie DELETE success',
      },
    },
  })
  @authenticate('jwt')
  async deleteById(@param.path.number('id') id: number): Promise<void> {

    let slides = await this.presentatieSlideController.find(id);
    if (slides.length > 0) {
      //delete video in presentation
      await this.removePresentatieVideo(id);

      //delete slides in google cloud
      await this.removePresentatieSlides(id);
    }

    //Implement Oswald delete entity
    await this.deletePresentatieEntity(id);

    //Delete from DB
    await this.presentatieRepository.deleteById(id);
  }

  // Upload new presentation router
  @get('/uploadPresentatie/{id}/{naam}', {
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
  // Method to upload presentation
  async uploadPresentatie(
    @param.path.number('id') id: number,
    @param.path.string('naam') naam: string
  ): Promise<object> {
    // // Storing pptx in multer memory
    // const storage = multer.memoryStorage();
    // const upload = multer({ storage });
    // return new Promise<object>((resolve, reject) => {
    //   upload.any()(request, response, async err => {
    //     if (err) return reject(err);

    //     let result;

    // //Get old slides
    // let slides = await this.presentatieSlideController.find(id);

    // // Delete old db slides
    // await this.presentatieSlideController.delete(id);

    //     // Converting memory stored pptx
    //     await this.convertPPTx(request.files, naam, id, slides);


    //     resolve({
    //       files: request.file,
    //       fields: (request as any).fields,
    //     });
    //   });
    // });

    // New code create slides from upload
    //Get old slides
    let oldSlides = await this.presentatieSlideController.find(id);

    // Delete old db slides
    await this.presentatieSlideController.delete(id);

    // Declarations for conversion
    // var fs = require('fs');
    // var cloudconvert = new (require('cloudconvert'))(process.env.CLOUDCONVERT);
    // var rawData = fs.readFileSync(process.env.GCS_KEYFILE);
    // var keyfile = JSON.parse(rawData);
    // var filename = files[0].originalname;

    let zwevendeSlides = JSON.parse(JSON.stringify(oldSlides));
    let newSlides = new Array<Slide>();

    // Get presentation name
    var presentatie = await this.presentatieRepository.findById(id);

    //Get slides
    let newImages = await this.getSlides(presentatie.url + '/new/');
    let oldImages = await this.getSlides(presentatie.url + '/old/');

    for (var i = 0; i < newImages.length; i++) {
      let exists = false;
      let newFilename = path.basename(newImages[i].image);
      for (var j = 0; j < oldImages.length; j++) {
        if (newImages[i].hash === oldImages[j].hash && !newImages[i].bekeken) {
          // Found same image
          exists = true;

          //Create existing slide
          await this.createExistingSlide(oldSlides, oldImages[j], id, newFilename, newImages[i], zwevendeSlides, newSlides)

        }
      }
      if (!exists) {
        // Create non existing slide
        await this.createNonExistingSlide(newFilename, id, newImages, newImages[i]);
      }
    }

    // Create floating text
    await this.createFloatingText(zwevendeSlides, id);

    // Delete old files
    await this.deleteSlides(presentatie.url + '/old/');

    // Get new files
    let files = await this.getFiles(presentatie.url + '/new/');

    //Move new files to old
    await this.moveSlides(files, presentatie.url + '/old/');

    return newSlides;
  }

  async createPresentatieEntity(naam: string) {

    //Declarations
    const chatbotId = '5d2ee9d9dec3e57e85a478ce';
    const baseUri = 'https://admin-api.oswald.ai/api/v1';
    const entityLabelId = '5d4965c03a50663b1d6ab381';
    let data = [];
    let value = {};
    let synonyms = [];
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
    };

    //POST request
    await axios.default.post(baseUri + '/entity-labels/' + entityLabelId + '/values', body, options).catch(err => console.log(err)).then();

    //Move to production
    //POST request to retrain chatbot
    const params = {
      'access_token': login['id']
    };
    await axios.default.post(baseUri + '/chatbots/' + chatbotId + '/move-to-production', {}, { params: params }).catch(err => console.log(err));
  }

  async updatePresentatieEntity(id: number, presentatie: Presentatie) {
    // Get old presentation name to update oswald entity
    var oudePresentatie = (await this.presentatieRepository.findById(id));

    //Update oswald entity
    //Declarations
    const chatbotId = '5d2ee9d9dec3e57e85a478ce';
    const baseUri = 'https://admin-api.oswald.ai/api/v1';
    const entityLabelId = '5d4965c03a50663b1d6ab381';
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
      if (entity['value']['nl'] == oudePresentatie.naam) {
        oudeEntity = entity;
        //Naam veranderen
        oudeEntity['value']['nl'] = presentatie.naam;
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
    };
    await axios.default.post(baseUri + '/chatbots/' + chatbotId + '/move-to-production', {}, { params: params }).catch(err => console.log(err));
  }

  async updatePresentatiesEntities(presentaties: Array<Presentatie>) {
    //Update oswald entity
    //Declarations
    const chatbotId = '5d2ee9d9dec3e57e85a478ce';
    const baseUri = 'https://admin-api.oswald.ai/api/v1';
    const entityLabelId = '5d4965c03a50663b1d6ab381';
    let credentials = {
      'email': process.env.OSWALD_USERNAME,
      'password': process.env.OSWALD_PASSWORD,
    };

    //get login access token
    const login = (await axios.default.post(baseUri + '/users/login', credentials))['data'];

    await Promise.all(presentaties.map(async presentatie => {
      const id = presentatie.ID;

      // Get old presentation name to update oswald entity
      const oudePresentatie = (await this.presentatieRepository.findById(id));

      //Get old Oswald Entity
      const oldoptions = {
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
        if (entity['value']['nl'] == oudePresentatie.naam) {
          oudeEntity = entity;
          //Naam veranderen
          oudeEntity['value']['nl'] = presentatie.naam;
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

      //PUT request
      await axios.default.put(baseUri + '/entity-labels/' + entityLabelId + '/values/' + oudeEntity["id"], body, options).catch(err => console.log(err));
    }));

    //Move to production
    //POST request to retrain chatbot
    const params = {
      'access_token': login['id']
    };
    await axios.default.post(baseUri + '/chatbots/' + chatbotId + '/move-to-production', {}, { params: params }).catch(err => console.log(err));
  }

  async deletePresentatieEntity(presentatieID: number) {
    // Get old presentation name to update oswald entity
    var presentatie = (await this.presentatieRepository.findById(presentatieID));

    //Update oswald entity
    //Declarations
    const chatbotId = '5d2ee9d9dec3e57e85a478ce';
    const baseUri = 'https://admin-api.oswald.ai/api/v1';
    const entityLabelId = '5d4965c03a50663b1d6ab381';
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
    var entityId;


    entities.forEach((entity: { [x: string]: any; }) => {
      if (entity['value']['nl'] == presentatie.naam) {
        entityId = entity["id"];
      }
    });

    console.log(entityId);


    //add acces token to options
    let options = {
      'headers': {
        'Content-Type': 'application/json',
      },
      'params': {
        'access_token': login['id'],
      },
    };


    //POST request
    await axios.default.delete(baseUri + '/entity-labels/' + entityLabelId + '/values/' + entityId, options).catch(err => console.log(err));

    //Move to production
    //POST request to retrain chatbot
    const params = {
      'access_token': login['id']
    };
    await axios.default.post(baseUri + '/chatbots/' + chatbotId + '/move-to-production', {}, { params: params }).catch(err => console.log(err));
  }

  // Method for converting PPTX to JPG
  // Upload new presentation router
  @get('/convertPresentatie/{naam}', {
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
  // @authenticate('jwt')
  // Method to upload presentation
  async convertPresentatie(
    @param.path.string('naam') naam: string
  ): Promise<any> {
    // Declarations for conversion
    var fs = require('fs');
    var cloudconvert = new (require('cloudconvert'))(process.env.CLOUDCONVERT);
    var rawData = fs.readFileSync(process.env.GCS_KEYFILE);
    var keyfile = JSON.parse(rawData);

    let body = {
      "apikey": process.env.CLOUDCONVERT,
      "inputformat": "pptx",
      "outputformat": "jpg",
      "input": "upload",
      "output": {
        "googlecloud": {
          "projectid": process.env.GCLOUD_PROJECT,
          "bucket": process.env.GCS_BUCKET,
          "credentials": keyfile,
          "path": naam + "/new/"
        }
      }
    };

    return (await axios.default.post("https://api.cloudconvert.com/v1/process", body)).data;
  }

  async getFiles(prefix: any) {
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

    return await bucket.getFiles({
      prefix: prefix
    });
  }

  async createExistingSlide(oldSlides: any, oldImage: any, presentatieID: number, newFilename: any, newImage: any, zwevendeSlides: any, newSlides: any) {
    console.log("CreateExisting");
    // Get filenames
    let oldFilename = path.basename(oldImage.image);
    let slide = new Slide;
    let newFileNumber;
    let oldfileNumber;

    // Get old filenumber
    if (((oldFilename.lastIndexOf(".")) - (oldFilename.lastIndexOf("-"))) > 2) {
      oldfileNumber = parseInt(oldFilename.substring(oldFilename.lastIndexOf("-") + 1, oldFilename.lastIndexOf(".")));
    }
    else {
      oldfileNumber = parseInt(oldFilename[oldFilename.lastIndexOf("-") + 1])
    }

    // Get new filenumber
    if (((newFilename.lastIndexOf(".")) - (newFilename.lastIndexOf("-"))) > 2) {
      newFileNumber = parseInt(newFilename.substring(newFilename.lastIndexOf("-") + 1, newFilename.lastIndexOf(".")));
    }
    else {
      newFileNumber = parseInt(newFilename[newFilename.lastIndexOf("-") + 1])
    }

    if (oldSlides.length < 2) {
      slide = oldSlides[0];
      slide.volgnummer = 1;
    }
    else {
      for (var k = 0; k < oldSlides.length; k++) {

        if (oldSlides[k].volgnummer === oldfileNumber) {
          slide = JSON.parse(JSON.stringify(oldSlides[k]));
          await new Promise<any>((resolve, reject) => {
            zwevendeSlides.splice(zwevendeSlides.findIndex((zwevendeSlide: any) => {
              return zwevendeSlide.ID === oldSlides[k].ID;
            }), 1);
            // let pos = zwevendeSlides.map((slide:  any) => slide.volgnummer).indexOf(oldSlides[k].volgnummer);
            resolve();
          });
          slide.ID = undefined;
        }
      }
      slide.volgnummer = newFileNumber;
    }

    slide.afbeelding = newFilename;
    await this.presentatieSlideController.create(presentatieID, slide);
    newImage.bekeken = true;

    return;
  }

  async createNonExistingSlide(newFilename: any, presentatieID: number, newImages: any, newImage: any) {
    console.log("CreateNonExisting");
    let newFileNumber;

    // Get new filenumber
    if (((newFilename.lastIndexOf(".")) - (newFilename.lastIndexOf("-"))) > 2) {
      newFileNumber = parseInt(newFilename.substring(newFilename.lastIndexOf("-") + 1, newFilename.lastIndexOf(".")));
    }
    else {
      newFileNumber = parseInt(newFilename[newFilename.lastIndexOf("-") + 1])
    }

    console.log(newFileNumber);

    let slide = new Slide();
    slide.afbeelding = newFilename;
    if (newImages.length < 2) {
      slide.volgnummer = 1;
    }
    else {
      slide.volgnummer = newFileNumber;
    }
    slide.presentatieID = presentatieID;
    await this.presentatieSlideController.create(presentatieID, slide);
    newImage.bekeken = true;

    return;
  }

  async createFloatingText(slides: any, presentatieID: number) {
    console.log("CreateFloating");
    for (var i = 0; i < slides.length; i++) {
      if (slides[i].tekst !== null && slides[i].ssml !== null) {
        let zwevendeTekst = new ZwevendeTekst();
        zwevendeTekst.ssml = slides[i].ssml;
        zwevendeTekst.tekst = slides[i].tekst;
        await this.presentatieZwevendeTekstController.create(presentatieID, zwevendeTekst);
      }
    }

    return;
  }

  async moveSlides(files: any, prefix: string) {
    console.log("MoveSlides");
    for (var i = 0; i < files.length; i++) {
      for (var j = 0; j < files[i].length; j++) {
        await files[i][j].move(prefix + path.basename(files[i][j].name));
      };
    };

    return;
  }

  async deleteSlides(prefix: string) {
    console.log("DeleteSlides");
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

    if (await bucket.getFiles({
      prefix: prefix
    })) {
      await bucket.deleteFiles({
        prefix: prefix
      });
    }

    return;
  }

  async getSlides(prefix: string) {
    console.log("GetSlides");

    // Get files
    let files = await this.getFiles(prefix);

    //Declarations for new images
    var datum = new Date();
    datum.setDate(datum.getDate() + 1);
    var config = {
      action: 'read',
      expires: datum,
    };

    let Images: any = [];

    // Get new files
    for (var i = 0; i < files.length; i++) {
      for (var j = 0; j < files[i].length; j++) {
        let imageInfo = await files[i][j].getMetadata();
        let uri = await files[i][j].getSignedUrl(config);
        const imageHashConfig = {
          uri: uri[0]
        };
        Images.push(await new Promise<any>((resolve, reject) => {
          imageHash.imageHash(imageHashConfig, 16, true, (error: any, data: any) => {
            if (error) throw error;
            let infoObject = {
              image: imageInfo[0].name,
              hash: data,
              bekeken: false
            };
            resolve(infoObject);
          });
        }));
      }
    }

    return Images;
  }

  async removePresentatieSlides(presentatieId: number) {

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
    var presentatie = await this.presentatieRepository.findById(presentatieId);

    if (await bucket.getFiles({
      prefix: presentatie.url + '/'
    })) {
      await bucket.deleteFiles({
        prefix: presentatie.url + '/'
      });
    }

    await this.presentatieSlideController.delete(presentatieId);
  }

  async removePresentatieVideo(presentatieId: number) {
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

    // Get video name
    let slides = await this.presentatieSlideController.find(presentatieId);

    // Get video name
    await new Promise<any>((resolve, reject) => {
      slides.forEach(slide => {
        if (slide.video) {
          bucket.file('video/' + slide.video).delete();
        }
      });
      resolve();
    });
    return "Video verwijderd!";
  }
}
