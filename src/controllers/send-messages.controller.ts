// import {inject} from '@loopback/context';
import * as admin from 'firebase-admin';
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
import { authenticate } from '@loopback/authentication';


export class SendMessagesController {

  registrationToken: any;

  constructor() {
    this.registrationToken = process.env.FCM_ANDROID_REGISTRATION_TOKEN;
  }

  @get('/sendMessage/startListening', {
    responses: {
      '200': {
        description: 'Start listening'
      },
    },
  })
  // @authenticate('jwt')
  async startListening(): Promise<any> {
    this.sendMessageToDevice('0');
  }

  @get('/sendMessage/stopListening', {
    responses: {
      '200': {
        description: 'Stop listening'
      },
    },
  })
  // @authenticate('jwt')
  async stopListening(): Promise<any> {
    this.sendMessageToDevice('1');
  }

  @get('/sendMessage/nextSlide', {
    responses: {
      '200': {
        description: 'Next slide'
      },
    },
  })
  // @authenticate('jwt')
  async nextSlide(): Promise<any> {
    this.sendMessageToDevice('2');
  }

  @get('/sendMessage/previousSlide', {
    responses: {
      '200': {
        description: 'Start listening'
      },
    },
  })
  // @authenticate('jwt')
  async previousSlide(): Promise<any> {
    this.sendMessageToDevice('3');
  }

  @get('/sendMessage/enterFullScreen', {
    responses: {
      '200': {
        description: 'Enter powerpoint full screen mode'
      },
    },
  })
  // @authenticate('jwt')
  async enterFullScreen(): Promise<any> {
    this.sendMessageToDevice('4');
  }

  @get('/sendMessage/exitFullScreen', {
    responses: {
      '200': {
        description: 'Exit powerpoint full screen mode'
      },
    },
  })
  // @authenticate('jwt')
  async exitFullScreen(): Promise<any> {
    this.sendMessageToDevice('5');
  }

  sendMessageToDevice(title: string) {
    const payload = {
      notification: {
        title: title,
        body: ''
      }
    };

    const options = {
      priority: "high",
      timeToLive: 60 * 60 * 24
    };

    admin.messaging().sendToDevice(this.registrationToken, payload, options)
      .then(function(response) {
        console.log("Successfully sent message:", response);
      })
      .catch(function(error) {
        console.log("Error sending message:", error);
      });
  }
}
