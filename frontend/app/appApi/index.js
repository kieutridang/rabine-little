
import auth from './auth';
import client from './client';
import dronePlan from './dronePlan';
import site from './site';
import sitePhoto from './sitePhoto';
import repairs from './repairs';
import s3 from './s3';
import comment from './comment';
import repairComment from './repairComment';
import order from './order';

export default {
  ...auth,
  ...client,
  ...dronePlan,
  ...site,
  ...sitePhoto,
  ...repairs,
  ...s3,
  ...comment,
  ...repairComment,
  ...order,
};

