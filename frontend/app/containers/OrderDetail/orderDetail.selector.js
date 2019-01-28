import { createSelector } from 'reselect';

const selectOrderDetail = (state) => state.get('orderDetail');

const makeIsOrderEditOpen = () => createSelector(
  selectOrderDetail,
  (state) => state.get('isOpenEdit')
);

const makeSelectError = () => createSelector(
  selectOrderDetail,
  (state) => state.get('error') ? state.get('error').message : null
);

const makeSelectOrder = () => createSelector(
  selectOrderDetail,
  (state) => state.get('order')
);

const makeGetLoadingState = () => createSelector(
  selectOrderDetail,
  (state) => state.get('isLoading')
);

const selectOrderNoteContent = () => createSelector(
  selectOrderDetail,
  (state) => state.get('orderNoteContent')
);

const selectIsOrderActivitiesLoading = () => createSelector(
  selectOrderDetail,
  (state) => state.get('isOrderActivitiesLoading')
);

const selectOrderActivities = () => createSelector(
  selectOrderDetail,
  (state) => state.get('orderActivities')
);

export {
  makeIsOrderEditOpen,
  makeSelectError,
  makeSelectOrder,
  makeGetLoadingState,
  selectOrderNoteContent,

  selectIsOrderActivitiesLoading,
  selectOrderActivities,
};

