import { createSelector } from 'reselect';

const selectSitePdf = (state) => state.get('pdfDoc');

const makeSelectPdf = () =>
  createSelector(selectSitePdf, (state) => state.get('pdfDocument'));


export {
  makeSelectPdf,
};
