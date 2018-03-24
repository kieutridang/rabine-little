/**
 * Root saga, it always watch for action, use for special case like login & logout
 */

// vendor
import { fork } from 'redux-saga/effects';
// app

import { loginWatcher, signupWatcher, logoutWatcher } from './auth';
import { addClientWatcher, addGetClientsWatcher } from './client';
import { addSiteWatcher, addGetSitesWatcher } from './site';
import { addGetDronePlansWatcher } from './dronePlan';


export default function* root() {
  yield fork(loginWatcher);
  yield fork(signupWatcher);
  yield fork(logoutWatcher);

  yield fork(addClientWatcher);
  yield fork(addGetClientsWatcher);

  yield fork(addSiteWatcher);
  yield fork(addGetSitesWatcher);
  yield fork(addGetDronePlansWatcher);
}
