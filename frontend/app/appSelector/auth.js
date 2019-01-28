import { createSelector } from 'reselect';

const makeSelectCurrentUser = () => createSelector(
  (state) => state.get('global'),
  (state) => state.get('user'),
);

export {
  makeSelectCurrentUser,
};
