import { BootMixin } from '@loopback/boot';
import { ApplicationConfig } from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import { RepositoryMixin } from '@loopback/repository';
import { RestApplication } from '@loopback/rest';
import { ServiceMixin } from '@loopback/service-proxy';
import * as path from 'path';
import { MySqldbDataSource } from './datasources';
import { MySequence, MyAuthenticationSequence } from './sequence';
import * as dotenv from 'dotenv';
import { AuthenticationComponent, registerAuthenticationStrategy } from '@loopback/authentication';
import { JWTAuthenticationStrategy } from './authentication-strategies/jwt-strategy';
import { JWTService } from './services/jwt-service';
import {
  TokenServiceBindings,
  UserServiceBindings,
  TokenServiceConstants,
} from './keys';
import { PasswordHasherBindings } from './keys';
import { BcryptHasher } from './services/hash.password.bcryptjs';
import { MyUserService } from './services/user-service';

export class CoPresenterApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up dotenv
    require('dotenv').config();

    // set up datasource
    if (process.env.DB_URL) {
      var dataSourceConfig = {
        name: 'mysql-beerless',
        connector: 'mysql',
        socketPath: process.env.DB_SOCKETPATH,
        database: process.env.DB_DATABASE,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        connectTimeout: 1000000
      };
      this.bind('datasources.config.MySQLDB').to(dataSourceConfig);
    }

    // Bind authentication component related elements
    this.component(AuthenticationComponent);

    // Set up the custom sequence
    this.sequence(MyAuthenticationSequence);

    registerAuthenticationStrategy(this, JWTAuthenticationStrategy);

    this.setUpBindings();

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.bind(RestExplorerBindings.CONFIG).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }

  setUpBindings(): void {

    this.bind(TokenServiceBindings.TOKEN_SECRET).to(
      TokenServiceConstants.TOKEN_SECRET_VALUE,
    );

    this.bind(TokenServiceBindings.TOKEN_EXPIRES_IN).to(
      TokenServiceConstants.TOKEN_EXPIRES_IN_VALUE,
    );

    this.bind(TokenServiceBindings.TOKEN_SERVICE).toClass(JWTService);

    // Bind bcrypt hash services - utilized by 'UserController' and 'MyUserService'
    this.bind(PasswordHasherBindings.ROUNDS).to(10);
    this.bind(PasswordHasherBindings.PASSWORD_HASHER).toClass(BcryptHasher);

    this.bind(UserServiceBindings.USER_SERVICE).toClass(MyUserService);
  }
}
