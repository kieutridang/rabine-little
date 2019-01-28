import styled from 'styled-components';

export const BidSheetWrapper = styled.div`
  width: 100%;
`;

export const BidSheetPreview = styled.div`
  grid-area: pdfPreview;
  margin: 2rem 2rem;
`;

export const BidSheetContent = styled.div`
  display: grid;
  grid-template-areas:  "sidebar pdfPreview";
  grid-template-columns: 0.7fr 2fr;
`;
