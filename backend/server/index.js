import mongoose from 'mongoose';
import corsHeaders from 'hapi-cors-headers';
import Hapi from 'hapi';
import ws from 'socket.io';
import {
  mongoUrl,
  appPort,
  jwtSecretKey
} from '~/config';

import logger from 'utils/logger';

import UserDB from '~/schemas/User';

import {
  Authentication,
  Client,
  ClientNote,
  ClientBidSheet,
  Site,
  DronePartner,
  PlanDeploy,
  Repair,
  S3Folder,
  PhotoExif,
  AreaPhoto,
  User,
  S3AWS,
  AreaVideo,
  CompanyLogo,
  AppInfo,
  AreaPhotoAnnotation,
  AreaPhotoRepair,
  HVAC,
  RoofingFeature,
  SyncFeatureToRoofing
} from '~/models';

import routes from './routes';
import plugins from './plugins';
import initialize from './rabine/socket';

const registerAuth = (serverInstance) => {
  serverInstance.auth.strategy('token', 'jwt', {
    key: jwtSecretKey,
    validateFunc: async (request, decodedToken, callback) => {
      if (!decodedToken) {
        callback(null, false);
      }

      const { username } = decodedToken.userInfo;
      const data = await UserDB.findOne({ username }, { password: 0 });
      const isValidToken = !!data;

      callback(null, isValidToken, data);
    },
    verifyOptions: { algorithms: ['HS256'] }
  });
};

const server = new Hapi.Server();

mongoose.connect(mongoUrl);
const db = mongoose.connection;

server.connection({
  port: process.env.PORT || appPort
});

initialize(ws(server.listener));

// register plugins
const startServer = async () => {
  try {
    const appInfo = new AppInfo();
    const hvac = new HVAC();
    const s3Folder = new S3Folder();
    const areaVideo = new AreaVideo({ s3Folder });
    const photoExif = new PhotoExif();
    const authentication = new Authentication();
    const client = new Client();
    const clientNote = new ClientNote();
    const clientBidSheet = new ClientBidSheet();
    const dronePartner = new DronePartner();
    const planDeploy = new PlanDeploy({ appInfo });
    const repair = new Repair();
    const areaPhoto = new AreaPhoto();
    const user = new User();
    const s3aws = new S3AWS({ areaPhoto, areaVideo });
    const companyLogo = new CompanyLogo();
    const roofingFeature = new RoofingFeature();
    const areaPhotoAnnotation = new AreaPhotoAnnotation();
    const syncFeatureToRoofing = new SyncFeatureToRoofing();
    const areaPhotoRepair = new AreaPhotoRepair();

    const site = new Site({
      dronePartner,
      client,
      logger,
      repair,
      planDeploy,
      s3Folder,
      photoExif,
      areaPhoto,
      areaVideo,
      s3aws,
      hvac,
      roofingFeature,
      areaPhotoRepair
    });

    planDeploy.loadOption({ site });
    clientNote.loadOption({ site });
    clientBidSheet.loadOption({ site });
    s3Folder.loadOption({ site });
    repair.loadOption({ areaPhoto });
    s3aws.loadOption({ site });
    repair.loadOption({ area: site.Area });

    await server.register(plugins);
    registerAuth(server);

    server.ext('onPreResponse', corsHeaders);
    server.ext('onPreHandler', (request, reply) => {
      Object.assign(request.server, {
        authentication,
        db,
        site,
        client,
        clientNote,
        clientBidSheet,
        dronePartner,
        planDeploy,
        repair,
        s3Folder,
        user,
        s3aws,
        companyLogo,
        areaPhotoAnnotation,
        areaPhotoRepair,
        hvac,
        roofingFeature,
        syncFeatureToRoofing
      });
      reply.continue();
    });

    server.route(routes);
  } catch (error) {
    logger.info('There is an error', error);
    throw error;
  }

  server.start();
};

const stopServer = async () => {
  server.stop({ timeout: 10 * 1000 }, () => {
    logger.info('Shutting down server');
    process.exit(0);
  });
};

// export modules
module.exports = {
  startServer,
  stopServer
};
