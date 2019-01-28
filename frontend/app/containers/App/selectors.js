/**
 * The global state selectors
 */

import { createSelector } from 'reselect';

const selectGlobal = (state) => state.get('global');
const selectRoute = (state) => state.get('route');

const makeSelectLoading = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('loading')
);

const errors = {
  Unauthorized: 'Email or Password is invalid',
};

const makeSelectError = () => createSelector(
  selectGlobal,
  (globalState) => {
    const errorState = globalState.get('error');
    if (errorState) {
      return errors[errorState.error] || errorState.message;
    }
    return '';
  }
);

const makeSelectLocation = () => createSelector(
  selectRoute,
  (routeState) => routeState.get('location').toJS()
);

const makeSelectAuthLoading = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('authLoading')
);

const makeSelectInvitedUser = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('invitedUser')
);

export {
  selectGlobal,
  makeSelectLoading,
  makeSelectError,
  makeSelectLocation,
  makeSelectAuthLoading,
  makeSelectInvitedUser,
};
