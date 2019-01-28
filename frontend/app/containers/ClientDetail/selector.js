import { createSelector } from 'reselect';

const defaultLat = 37.3113337;
const defaultLng = -121.8735262;

const ClientDetail = (state) => state.get('clientDetail');

const IsLoadingDetail = () => createSelector(
  ClientDetail,
  (clientDetail) => clientDetail.get('isDetailLoading')
);
const DetailData = () => createSelector(
  ClientDetail,
  (clientDetail) => clientDetail.get('detailData')
);
const ClientNoteData = () => createSelector(
  ClientDetail,
  (clientDetail) => clientDetail.get('clientNoteData')
);

const clientLocation = () => createSelector(
  ClientDetail,
  (clientDetail) => {
    const detail = clientDetail.get('detailData');
    if (detail && detail.location) {
      const { lat, lng } = detail.location;
      return [lat, lng];
    }

    return [defaultLat, defaultLng];
  }
);

const NoteContent = () => createSelector(
  ClientDetail,
  (clientDetail) => clientDetail.get('noteContent')
);

const IsUpdatingStatus = () => createSelector(
  ClientDetail,
  (clientDetail) => clientDetail.get('isUpdatingStatus')
);

const UpdateStatusError = () => createSelector(
  ClientDetail,
  (clientDetail) => clientDetail.get('updateStatusError')
);

const IsUpdateStatusSuccessfully = () => createSelector(
  ClientDetail,
  (clientDetail) => clientDetail.get('isUpdateStatusSuccessfully')
);

const IsOpen = () => createSelector(
  ClientDetail,
  (clientDetail) => clientDetail.get('isOpenEdit')
);

export {
  ClientDetail,
  IsLoadingDetail,
  DetailData,
  ClientNoteData,
  clientLocation,
  NoteContent,
  IsUpdatingStatus,
  UpdateStatusError,
  IsUpdateStatusSuccessfully,
  IsOpen,
};
