import config from '../config';

export const RESTART_ON_REMOUNT = '@@saga-injector/restart-on-remount';
export const DAEMON = '@@saga-injector/daemon';
export const ONCE_TILL_UNMOUNT = '@@saga-injector/once-till-unmount';
export const { API_URL, APP_URL } = config;
export const API_LOGIN_PATH = 'authentication/login';
export const API_SIGNUP_PATH = 'authentication/register';
export const API_LOGOUT_PATH = 'authentication/logout';
export const API_DRONEPARTNER_PATH = 'dronePartner';
export const API_SITE_DETAIL_BY_ID = (id, token = '') => `site/${id}/design${token ? `?token=${token}` : ''}`;
export const API_SITE_DETAIL_ACTIVITY_BY_ID = (siteId) => `site/${siteId}/activity`;
export const API_SITE_ID = (siteId) => `site/${siteId}`;
export const API_SITE_MAP_DATA_BY_ID = (id) => `site/${id}/map`;
export const API_SITE_UPDATE_SITE_MAP_DATA_BY_ID = (id) => `site/${id}/map`;
export const API_CLIENT_DETAIL_BY_ID = (id) => `client/${id}`;
export const API_CLIENT_ID = (clientId) => `client/${clientId}`;
export const API_CLIENT_DETAIL_NOTE_BY_ID = (clientId) => `client/${clientId}/note`;
export const PHOTO_ZOOM_LEVEL = {
  MAX: 9,
  MIN: 1,
};
export const USER_ADMIN = 'admin';
export const USER_USER = 'User';
export const USER_CLIENT = 'Client';
export const ADMIN_TYPE = [USER_USER, USER_CLIENT];
export const USER_TYPE = [USER_CLIENT];
