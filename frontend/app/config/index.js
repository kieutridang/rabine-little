import { SocketConst } from '../containers/SiteMapPage/constants';

const configs = {
  local: {
    API_URL: process.env.API_URL || `${SocketConst.LOCALHOST}/api`,
    APP_URL: process.env.APP_URL || SocketConst.LOCALHOST,
  },
  test: {
    API_URL: process.env.API_URL || `${SocketConst.LOCALHOST}/api`,
    APP_URL: process.env.APP_URL || SocketConst.LOCALHOST,
  },
  development: {
    API_URL: process.env.API_URL || 'https://d.api.sitetechnologies.io/api',
    APP_URL: process.env.APP_URL || 'https://d.api.sitetechnologies.io',
    SYNC_PHOTO_API_URL: process.env.SYNC_PHOTO_API_URL || 'https://rabinesiteimagetransferprod.herokuapp.com/api/sites',
  },
  staging: {
    API_URL: process.env.API_URL || 'https://s.api.sitetechnologies.io/api',
    APP_URL: process.env.APP_URL || 'https://s.api.sitetechnologies.io',
  },
  production: {
    API_URL: process.env.API_URL || 'https://api.sitetechnologies.io/api',
    APP_URL: process.env.APP_URL || 'https://api.sitetechnologies.io',
  },
};

const config = configs[process.env.NODE_ENV || 'development'];

export default config;
