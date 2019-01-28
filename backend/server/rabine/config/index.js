const {
  PORT,
  ENV,
  AWS_ACCESS_KEY,
  AWS_SECRET_KEY,
  AWS_REGION,
  AWS_API_VERSION,
  AWS_S3_URL,
  DRONE_KEY,
  EXPORT_EMAIL,
  EXPORT_PROJECTION,
  AWS_BUCKET,
  IMAGE_LAMBDA_URL,
  GOOGLE_API_KEY,
  ENFORCE_SSL,
  MONGODB_URI,
  AWS_RABINE_UPLIFT,
  CLIENT_URL,
  PRODUCT_NAME,
  PRIMARY_EMAIL,
  SENDGRID_API_USER,
  SENDGRID_API_KEY,
  S3_TRANSFER_URL
} = process.env;

export const ENVs = {
  dev: {
    DB_URL:
      'mongodb://mongodb-stitch-rabinesite-iiehc:fJ2tsqybmPifZ0YF@rabinesite-shard-00-00-4zajc.mongodb.net:27017,rabinesite-shard-00-01-4zajc.mongodb.net:27017,rabinesite-shard-00-02-4zajc.mongodb.net:27017/rabinesite?ssl=true&replicaSet=RabineSite-shard-0&authSource=admin'
  },
  prod: {
    DB_URL:
      'mongodb://rabinesite:bL9XNd12SBoBFxUz@rabinesiteprod-shard-00-00-47ndw.mongodb.net:27017,rabinesiteprod-shard-00-01-47ndw.mongodb.net:27017,rabinesiteprod-shard-00-02-47ndw.mongodb.net:27017/rabinesite?ssl=true&replicaSet=RabineSiteProd-shard-0&authSource=admin'
  }
};

export const appEnv = ENV || 'dev';
export const { DB_URL } = ENVs[appEnv];

export const appPort = PORT || '5000';

export const AWSAccessKeyId = AWS_ACCESS_KEY;
export const AWSSecretAccessKey = AWS_SECRET_KEY;
export const AWSRegion = AWS_REGION || 'us-west-2';
export const AWSBucket = AWS_BUCKET || 'rabinesite';
export const AWSAPIVersion = AWS_API_VERSION || '2006-03-01';
export const AWSPublicUrl = AWS_S3_URL || 'https://rabinesite.s3.amazonaws.com';

export const S3TransferUrl = S3_TRANSFER_URL || 'https://rabines3transferdev.herokuapp.com';

export const droneKey = DRONE_KEY;
export const exportEmail = EXPORT_EMAIL || 'hien@launchdeck.org';
export const projectionCode = EXPORT_PROJECTION || 3857;
export const mongoUrl = MONGODB_URI || DB_URL;
export const imageLambdaUrl = IMAGE_LAMBDA_URL || 'https://2zls31e3r0.execute-api.us-west-2.amazonaws.com/development/resize-image';

export const googleApiKey = GOOGLE_API_KEY || 'AIzaSyAGnmzTSXkqaQDkTHGzuxXnnPgq5OfpLDM';
export const enforceSSL = ENFORCE_SSL === 'true';

export const jwtSecretKey = 'RabineSite';

export const AWSRabineUpliftDest = AWS_RABINE_UPLIFT || 'rabine-uplift-dev'; // S3 folder of Rabine Site
export const AWSRabineUpliftSrc = 'upliftdata-rabine'; // S3 folder of Uplift company

export const clientUrl = CLIENT_URL || 'http://localhost:3000';
export const productName = PRODUCT_NAME || 'RabineSite';
export const primaryEmail = PRIMARY_EMAIL || 'admin@sitetechnologies.io';
export const sgApiUser = SENDGRID_API_USER || 'Noahberkson';
export const sgApiKey = SENDGRID_API_KEY || 'Berkson01';

export default {
  appPort,
  appEnv,
  mongoUrl,

  droneKey,
  exportEmail,
  projectionCode,

  AWSAccessKeyId,
  AWSSecretAccessKey,
  AWSRegion,
  AWSAPIVersion,
  AWSPublicUrl,
  AWSBucket,
  jwtSecretKey,
  imageLambdaUrl,
  AWSRabineUpliftDest,
  AWSRabineUpliftSrc,

  googleApiKey,
  enforceSSL,

  clientUrl,
  productName,
  primaryEmail,
  sgApiUser,
  sgApiKey,
  S3TransferUrl
};
