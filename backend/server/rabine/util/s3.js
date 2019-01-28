import AWS from 'aws-sdk';

import {
  AWSBucket,
  AWSAccessKeyId,
  AWSSecretAccessKey,
  AWSRegion,
  AWSAPIVersion
} from '~/constants';

AWS.config.update({
  accessKeyId: AWSAccessKeyId,
  secretAccessKey: AWSSecretAccessKey,
  signatureVersion: 'v4',
  region: AWSRegion
});

const s3 = new AWS.S3({
  apiVersion: AWSAPIVersion
});

export const getSignedURL = async (config) => {
  const {
    fileKey,
    bucket,
    type,
    expires = 180,
    ACL = 'public-read'
  } = config;
  const url = await new Promise((resolve, reject) => {
    const Bucket = bucket || AWSBucket;
    s3.getSignedUrl('putObject', {
      Bucket,
      Key: fileKey,
      ContentType: type,
      Expires: expires,
      ACL
    }, (err, signedURL) => {
      if (err) {
        reject(err);
      } else {
        const publicURL = `https://s3.eu-central-1.amazonaws.com/${Bucket}/${fileKey}`;
        resolve({ signedURL, publicURL, config });
      }
    });
  });
  return url;
};

export default s3;
