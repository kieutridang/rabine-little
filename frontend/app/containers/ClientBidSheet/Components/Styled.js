import styled from 'styled-components';

const backgroundColor = '#ffffff';

export const BidSheetWrapper = styled.div`
  width: 100%;
  overflow: scroll;
`;

export const BidSheetHeader = styled.div`
  width: 100%;
  padding: 20px 80px;
  background-color: #ffffff;
  border: solid 1px #efeff1;
  text-align: left;
  color: #545558;
  display: grid;
  grid-template-areas: "title saveButton";
  grid-template-columns: 250px 1fr;
`;

export const BidSheetCreatorContent = styled.div`
    display: grid;
    width: 100%;
    height: calc(100vh - 150px);
    grid-template-areas:  "bid_sheet pdfPreview";
    grid-template-columns: 1.5fr 2fr;
    grid-column-gap: 3.5rem;
    padding: 1.25rem 1rem;
`;

export const BidSheetInfo = styled.section`
  grid-area: bid_sheet;
  background: ${backgroundColor};
  display: grid;
  grid-template-areas:
    "stepper"
    "options"
    "nextButton";
  grid-template-rows: 66px 1fr auto;
  border: 1px solid #efeff1;
  max-height: 700px;
`;

export const BidSheetStepper = styled.div`
  grid-area: stepper;
  align-self: center;
  margin: 2rem 3.75rem;
`;

export const BidSheetOptions = styled.section`
  grid-area: options;
`;

export const SaveButtonContainer = styled.div`
  grid-area: saveButton;
  justify-self: end;
`;

export const NextButtonContainer = styled.div`
  grid-area: nextButton;
  margin: 30px;
  justify-self: end;
`;

export const BidSheetPreview = styled.div`
  grid-area: pdfPreview;
 
`;

export const CustomCheckboxInput = styled.input`
  position: relative;
  appearance: none;
  width: 1.1rem;
  height: 1.1rem;
  background: hsla(0, 0%, 100%, 1);
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: background 100ms ease;
  cursor: pointer;

  outline: none;

  &:checked {
    background: hsla(360, 85%, 53%, 1);
    &:after {
      opacity: 1;
      transform: scale(1);
    }
  }

  &:after {
    content: '✔';
    
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    text-align: center;

    color: white;
    transition: all 180ms ease;
    font-size: 0.8125rem;

    opacity: 0;
    transform: scale(2.4);
  }
`;

export const MetadataInfo = styled.div`
  display: flex;
  flex-flow: row-wrap;
  position: relative;
  margin: 0.5rem 0;

  span {
    flex: 1;
    display: flex;
    align-items: center;
    &:last-child {
      flex: 8;
      text-transform: uppercase;
    }
  }
`;
