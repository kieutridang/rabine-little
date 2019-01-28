import { createSelector } from 'reselect';

const selectRepairs = (state) => state.get('repairs');

const makeSelectIsLoading = () =>
  createSelector(selectRepairs, (state) => state.get('isLoading'));

const makeSelectRepairs = () =>
  createSelector(selectRepairs, (state) => state.get('repairs'));

const makeCountRepairs = () => createSelector(
  selectRepairs,
  (state) => {
    const repairs = state.get('repairs');
    return repairs ? repairs.length : 0;
  }
);

export {
  makeSelectIsLoading,
  makeSelectRepairs,
  makeCountRepairs,
};
