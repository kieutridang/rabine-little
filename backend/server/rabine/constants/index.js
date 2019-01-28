import {
  droneKey,
  exportEmail,
  projectionCode,

  AWSAccessKeyId,
  AWSSecretAccessKey,
  AWSRegion,
  AWSAPIVersion,
  AWSPublicUrl,
  AWSBucket,
  imageLambdaUrl,
  AWSRabineUpliftDest,
  googleApiKey,
  clientUrl,
  productName,
  primaryEmail,
  sgApiUser,
  sgApiKey
} from '~/config';

export const ActivityType = {
  StatusChanged: 'status_changed',
  Comment: 'comment'
};

export const PhotoSizes = {
  ORIGINAL: 'original',
  THUMBNAIL: 'thumbnail'
};

export const PhotoParams = {
  quality: 40
};

export const SiteRepairTemplate = [
  {
    label: 'Title',
    value: 'title'
  },
  {
    label: 'Type of Repair',
    value: 'repairType'
  },
  {
    label: 'Year',
    value: 'year'
  },
  {
    label: 'Unit',
    value: 'unit'
  },
  {
    label: 'QTY',
    value: 'qty'
  },
  {
    label: 'Unit Price',
    value: 'unitPrice'
  },
  {
    label: 'Total',
    value: 'total'
  },
  {
    label: 'Zone',
    value: 'zone'
  },
  {
    label: 'Site Name',
    value: 'siteName'
  }
];

export const SiteZoneTemplate = [
  {
    label: 'Title',
    value: 'title'
  },
  {
    label: 'Area',
    value: 'area'
  },
  {
    label: 'PCI',
    value: 'pci'
  },
  {
    label: 'SURFACE TYPE',
    value: 'surfaceType'
  },
  {
    label: 'TRAFFIC TYPE',
    value: 'trafficType'
  },
  {
    label: 'Site Name',
    value: 'siteName'
  }
];

export const SocketConst = {
  REQ_GET_USERS_VIEWING_MAP: 'REQ_GET_USERS_VIEWING_MAP',
  RES_GET_USERS_VIEWING_MAP: 'RES_GET_USERS_VIEWING_MAP',
  REQ_USER_STOP_VIEWING_MAP: 'REQ_USER_STOP_VIEWING_MAP',
  RES_USER_STOP_VIEWING_MAP: 'RES_USER_STOP_VIEWING_MAP',
  ON_GLOBAL_UPDATE: 'ON_GLOBAL_UPDATE'
};
export {
  droneKey,
  exportEmail,
  projectionCode,

  AWSAccessKeyId,
  AWSSecretAccessKey,
  AWSRegion,
  AWSAPIVersion,
  AWSPublicUrl,
  AWSBucket,
  AWSRabineUpliftDest,
  imageLambdaUrl,

  googleApiKey,

  clientUrl,
  productName,
  primaryEmail,
  sgApiUser,
  sgApiKey
};
