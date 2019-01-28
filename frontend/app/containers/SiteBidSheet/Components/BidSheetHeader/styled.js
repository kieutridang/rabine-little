import styled from 'styled-components';

export const BidSheetHeaderContainer = styled.div`
  width: 100%;
  padding: 20px 80px;
  background-color: #ffffff;
  border: solid 1px #efeff1;
  text-align: left;
  color: #545558;
  display: grid;
  grid-template-areas: "title switchYear saveButton";
  grid-template-columns: 1fr 1.5fr 1fr;
`;

export const SwitchYearContainer = styled.div`
  grid-area: switchYear;
  justify-self: center;
  align-self: center;
`;

export const SaveButtonContainer = styled.div`
  grid-area: saveButton;
  justify-self: end;
  align-self: center;
  display: inline-flex;
`;
