import { createSelector } from 'reselect';

const selectBidSheet = (state) => state.get('bidSheet');

const makeSelectBidSheetValues = () => createSelector(
    selectBidSheet,
    (state) => state.get('bidSheetValues'),
);

const makeSelectBidSheetLoading = () => createSelector(
    selectBidSheet,
    (state) => state.get('isLoading'),
);

const makeSelectBidSheetError = () => createSelector(
    selectBidSheet,
    (state) => state.get('error'),
);

const makeSelectBidSheetSaved = () => createSelector(
    selectBidSheet,
    (state) => state.get('valuesSaved'),
);

export {
    makeSelectBidSheetValues,
    makeSelectBidSheetLoading,
    makeSelectBidSheetError,
    makeSelectBidSheetSaved,
};
