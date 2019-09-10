// import {inject} from '@loopback/context';
import * as admin from 'firebase-admin';
import {
  get,
  RestBindings,
  Request,
} from '@loopback/rest';
import {
  authenticate,
  TokenService,
} from '@loopback/authentication';
import {inject} from '@loopback/context';
import {TokenServiceBindings} from '../keys';
import {PresentatieSlideController} from './presentatie-slide.controller';
import {UserRegistrationTokenController} from './user-registration-token.controller';
var jwt_decode = require('jwt-decode');

export class SendMessagesController {

  constructor(
    @inject(RestBindings.Http.REQUEST) public request: Request,
    @inject(TokenServiceBindings.TOKEN_SERVICE) public jwtService: TokenService,
    @inject('controllers.UserRegistrationTokenController') public userRegistrationTokenController: UserRegistrationTokenController,
  ) {
  }

  @get('/sendMessage/startListening', {
    responses: {
      '200': {
        description: 'Start listening',
      },
    },
  })
  @authenticate('jwt')
  async startListening(): Promise<any> {
    this.sendMessageToDevice('0');
  }

  @get('/sendMessage/stopListening', {
    responses: {
      '200': {
        description: 'Stop listening',
      },
    },
  })
  @authenticate('jwt')
  async stopListening(): Promise<any> {
    this.sendMessageToDevice('1');
  }

  @get('/sendMessage/nextSlide', {
    responses: {
      '200': {
        description: 'Next slide',
      },
    },
  })
  @authenticate('jwt')
  async nextSlide(): Promise<any> {
    this.sendMessageToDevice('2');
  }

  @get('/sendMessage/previousSlide', {
    responses: {
      '200': {
        description: 'Start listening',
      },
    },
  })
  @authenticate('jwt')
  async previousSlide(): Promise<any> {
    this.sendMessageToDevice('3');
  }

  @get('/sendMessage/enterFullScreen', {
    responses: {
      '200': {
        description: 'Enter powerpoint full screen mode',
      },
    },
  })
  @authenticate('jwt')
  async enterFullScreen(): Promise<any> {
    this.sendMessageToDevice('4');
  }

  @get('/sendMessage/exitFullScreen', {
    responses: {
      '200': {
        description: 'Exit powerpoint full screen mode',
      },
    },
  })
  @authenticate('jwt')
  async exitFullScreen(): Promise<any> {
    this.sendMessageToDevice('5');
  }

  @get('/sendMessage/startSpeaking', {
    responses: {
      '200': {
        description: 'Co-presenter starts speaking',
      },
    },
  })
  @authenticate('jwt')
  async startSpeaking(): Promise<any> {
    this.sendMessageToDevice('6');
  }

  async sendMessageToDevice(title: string) {
    // get registrationToken from current user
    let jwtToken, user, registrationTokens;

    if (this.request.headers.authorization) {
      jwtToken = this.request.headers.authorization.substr(7);
      user = jwt_decode(jwtToken);
      registrationTokens = await this.userRegistrationTokenController.find(user.id);

      // create payload
      const payload = {
        notification: {
          title: title,
          body: '',
        },
      };
      const options = {
        priority: 'high',
        timeToLive: 60 * 60 * 24,
      };

      // send message
      if (registrationTokens.length > 0) {
        admin.messaging().sendToDevice(registrationTokens[0].token, payload, options)
          .then(function(response) {
            console.log("Successfully sent message:", response);
          })
          .catch(function(error) {
            console.log("Error sending message:", error);
          });
      }
    }
  }
}
