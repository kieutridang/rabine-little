import { createSelector } from 'reselect';

const makeSelectIsSideBarMapOpen = () => createSelector(
    (state) => state.get('UI'),
    (state) => state.get('isSideBarMapOpen'),
);

export {
    makeSelectIsSideBarMapOpen,
};
