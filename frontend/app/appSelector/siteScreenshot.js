import { createSelector } from 'reselect';

const selectSiteScreenshot = (state) => state.get('siteScreenshot');

const makeSelectScreenshots = () => createSelector(
    selectSiteScreenshot,
    (state) => state.get('screenshots'),
);

const makeSelectScreenshotLoading = () => createSelector(
    selectSiteScreenshot,
    (state) => state.get('isLoading'),
);

const makeSelectScreenshotError = () => createSelector(
    selectSiteScreenshot,
    (state) => state.get('error'),
);

export {
    makeSelectScreenshots,
    makeSelectScreenshotLoading,
    makeSelectScreenshotError,
};
