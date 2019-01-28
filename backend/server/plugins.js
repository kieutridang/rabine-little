
/**
 * Vendor modules
 */

import Inert from 'inert';
import Vision from 'vision';
import HapiSwagger from 'hapi-swagger';
import Good from 'good';
import hapiAuthJWT from 'hapi-auth-jwt';

import { appEnv } from '~/config';

/**
 * Internal modules
 */

import Package from '../package.json';

const swagger = {
  register: HapiSwagger,
  options: {
    documentationPath: '/docs',
    info: {
      title: Package.description,
      version: Package.version
    },
    tags: [
      {
        name: 'authentication',
        description: 'authentication\'s api'
      },
      {
        name: 'client',
        description: 'client\'s api'
      },
      {
        name: 'site',
        description: 'site\'s api'
      },
      {
        name: 'plan deploy',
        description: 'plan deploy\'s api'
      }
    ],
    grouping: 'tags',
    pathPrefixSize: 4,
    securityDefinitions: {
      jwt: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header'
      }
    }
  }
};

/**
 * exports array of plugins with configuration.
 * @type {Array}
 */
const plugins = [
  Inert,
  Vision,
  swagger,
  hapiAuthJWT
];

if (appEnv === 'dev') {
  // add good console for log reporting
  const good = {
    register: Good,
    options: {
      reporters: {
        console: [{ module: 'good-console' }, 'stdout']
      }
    }
  };
  plugins.push(good);
}

module.exports = plugins;
