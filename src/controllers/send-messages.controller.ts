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
import {RegistrationTokenController} from './registration-token.controller';
import {UserRegistrationTokenController} from './user-registration-token.controller';
var jwt_decode = require('jwt-decode');

export class SendMessagesController {

  constructor(
    @inject(RestBindings.Http.REQUEST) public request: Request,
    @inject(TokenServiceBindings.TOKEN_SERVICE) public jwtService: TokenService,
    @inject('controllers.UserRegistrationTokenController') public userRegistrationTokenController: UserRegistrationTokenController,
    @inject('controllers.RegistrationTokenController') public registrationTokenController: RegistrationTokenController,
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

  @get('/sendMessage/startVideo', {
    responses: {
      '200': {
        description: 'Co-presenter plays included video',
      },
    },
  })
  @authenticate('jwt')
  async startVideo(): Promise<any> {
    this.sendMessageToDevice('7');
  }

  async sendMessageToDevice(msg: string) {
    // get registrationToken from current user
    let jwtToken, user, registrationTokens;

    if (this.request.headers.authorization) {
      jwtToken = this.request.headers.authorization.substr(7);
      user = jwt_decode(jwtToken);
      registrationTokens = await this.userRegistrationTokenController.find(user.id);

      // create payload
      const payload = {
        data: {
          msg: msg,
        },
      };
      const options = {
        priority: 'high',
        timeToLive: 60 * 60 * 24,
      };

      // send message
      if (registrationTokens.length > 0) {
        registrationTokens.map(registrationToken => {
          admin.messaging().sendToDevice(registrationToken.token, payload, options)
            .then(response => {
              console.log("Successfully sent message:", response);
              if (response.results[0].error) {
                if (response.results[0].error.code === 'messaging/registration-token-not-registered') {
                  this.registrationTokenController.deleteById(registrationToken.ID!);
                }
              }
            })
            .catch(error => {
              console.log(error);
            });
        });
      }
    }
  }
}
