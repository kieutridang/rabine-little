import { createSelector } from 'reselect';

const selectLoadings = (state) => [
  state.get('global').get('loading'),
  state.get('global').get('authLoading'),
  state.get('s3Folders').get('isLoading'),
  state.get('site').get('isLoading'),
  state.get('sitePhoto').get('isLoading'),
  state.get('client').get('isEditing'),
  state.get('order').get('isLoading'),
  state.get('siteDetail').get('isDetailLoading'),
  state.get('siteMetrics').get('isLoadingMetrics'),
  state.get('clientDetail').get('isDetailLoading'),
  state.get('clientDetail').get('isClientNoteLoading'),
  state.get('siteRepairs').get('isLoading'),
  state.get('comment').get('isLoadingComments'),
  state.get('comment').get('isLoadingSelected'),
  state.get('bidSheet').get('isLoading'),
  state.get('siteScreenshot').get('isLoading'),
  state.get('pdfDoc').get('isLoading'),
];

const makeGetLoadingState = () => createSelector(
    selectLoadings,
    (state) => {
      let loading = false;
      state.forEach((el) => {
        loading = el || loading;
      });
      return loading;
    }
);

export default makeGetLoadingState;
