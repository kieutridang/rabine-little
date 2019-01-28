/**
 * The global state selectors
 */

import { createSelector } from 'reselect';
import moment from 'moment';

const selectComment = (state) => state.get('repairComment');

const makeSelectError = () => createSelector(
  selectComment,
  (state) => state.get('errorComments') ? state.get('errorComments').message : null
);

const makeSelectComments = () => createSelector(
  selectComment,
  (state) => {
    const comments = state.get('comments');

    if (comments) {
      return comments.sort((left, right) =>
        moment.utc(right.createdDate).diff(moment.utc(left.createdDate)));
    }
    return comments;
  }
);

export {
  makeSelectError,
  makeSelectComments,
};
