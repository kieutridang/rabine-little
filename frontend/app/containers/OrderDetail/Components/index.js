import styled from 'styled-components';
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiCheckbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

export const DetailWrapper = styled.div`
  width: 100%;
  overflow: auto;
`;

export const DetailHeader = styled.div`
  width: 100%;
  padding: 20px 80px;
  background-color: #ffffff;
  border: solid 1px #efeff1;
  text-align: left;
  color: #545558;
  display: grid;
  grid-template-areas: "title stepper";
  grid-template-columns: 250px 1fr;
`;

export const DetailContent = styled.div`
  display: grid;
  width: 100%;
  height: 100vh;
  grid-template-areas:  "detail note note";
  grid-template-columns: 1fr 2fr;
  grid-column-gap: 5rem;
  padding: 1.25rem 5rem;
`;

// DETAIL SECTION
export const DetailInfo = styled.section`
  grid-area: detail;
`;

export const ExpansionPanel = styled(MuiExpansionPanel)`
  margin-bottom: 2rem;
`;

export const EditButton = styled.button`
  cursor: pointer;
  img {
    width: 20px;
    height: 20px;
  }
  &:focus {
    outline: none;
  }
  svg {
    width: 1.6rem;
    height: 1.6rem;
  }
`;


// NOTE SECTION
export const Note = styled.section`
  grid-area: note;
  position: relative;
  font-size: 12px;
  display: grid;
  grid-template-areas:  "editor"
                        "timeline";
  grid-template-rows: auto;
  grid-row-gap: 5rem;
`;

export const EditorSection = styled.section`
  grid-area: editor;
`;

export const TimelineSection = styled.section`
  grid-area: timeline;
`;

export const EditorWrapper = styled.div`
  padding: 16px 24px 48px 24px;
  position: relative;
  background-color: ${(props) => props.hasNoBackground ? 'transparent' : '#ffffff'};
  border: ${(props) => props.hasNoBorder ? 'none' : 'solid 1px #efeff1 !important'};
`;

export const EditorButton = styled.div`
  position: absolute;
  left: 14px;
  bottom: 0.5rem;

  .primary {
    color: #ffffff;
    width: 66px;
    height: 29px;
    border-radius: 3px;
    background-color: #ed2324;
    margin: 5px;
    cursor: pointer;
    &.disabled {
      cursor: not-allowed;
      opacity: 0.3;
    }
  }

  .secondary {
    width: 75px;
    height: 29px;
    opacity: 0.3;
    border-radius: 3px;
    border: solid 1px #454545;
    color: #373737;
    margin: 5px;
  }
`;

// ACTIVITY SECTION
export const Activity = styled.section`
  grid-area: activity;
`;

// SUMMARY
export const PanelSummaryWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0 !important;
`;

export const PanelSummaryProgressWrapper = styled.div`
  background-color: #ededed;
  height: 0.35rem;
  width: 100%;
  padding: 0 !important;
  margin-top: 12px;
`;

export const PanelSummaryProgress = styled.div`
  background-color: #ed2324;
  height: 0.35rem;
  width: ${(props) => props.width || '100%'};
`;

export const PanelSummaryInfoWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 24px;
`;

export const PanelSummaryTitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 1.3125rem;
  width: 100%;
`;

export const PanelTopSummaryWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const PanelSummaryTitle = styled.span`
  font-size: 1rem;
  font-weight: 600;
  margin-top: ${(props) => props.marginTop};
`;

export const PanelSummarySubTitle = styled.div`
  font-size: 0.825rem;
  font-weight: 400;
  opacity: 0.5;
`;

export const PanelExpandIcon = styled.div`
  svg {
    fill: #7b7b7b;
    color: #7b7b7b;
  }
  opacity: 0.6;
  transform: ${(props) => !props.expanded && 'rotate(-90deg)'};
  transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms
`;

export const AddButton = styled.button` background: #EA272E;
  width: 7.8125rem;
  height: 2.5rem;
  color: #FFFFFF;
  font-size: 14px;
  border-radius: 3px;
  padding: 10px 0;
  cursor: pointer;
  text-transform: uppercase;
`;

export const Form = styled.form`
  margin-bottom: 1em;
  background: white;
  border-radius: 5px;
  text-align: center;
  padding: 1rem 0;
`;

export const Input = styled.input`
  height: 40px;
  color: #ACAEB0;
  border-radius: 3px;
  background-color: #fbfbfb;
  border: solid 1px #cbccce;
  
  font-size: 14px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.29;
  letter-spacing: 0.5px;
  text-align: left;
  color: #707277;
  padding-left: 15px;
  padding-right: 15px;
  
  ::placeholder {
    opacity: 0.7;
  }
`;

export const InputWrap = styled.div`
  display: flex; 
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  text-align: left;

  label {
    text-transform: uppercase;
    justify-content: flex-start;
    font-weight: 600;
    font-size: 10px;
  }
  span {
    font-size: 10px;
    font-weight: 600;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: 0.4px;
    color: #707277;
    display: flex;
  }
  
  select {
    height: 40px;
    color: #ACAEB0;
    border-radius: 3px;
    background-color: #fbfbfb;
    border: solid 1px #cbccce;
    
    font-size: 14px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.29;
    letter-spacing: 0.5px;
    color: #707277;
    padding-left: 15px;
    padding-right: 15px;
    
    ::placeholder {
      opacity: 0.7;
    }
  }

  .SingleDatePickerInput__withBorder,
  .SingleDatePickerInput__withBorder:last-child {
    margin: 0;
  }
`;

export const ErrorMessage = styled.p`
    font-size: 14px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.29;
    letter-spacing: 0.5px;
    
    text-transform: none;
    color: #EA272E;
    text-align: ${(props) => props.align || 'right'};
    margin: 4px 0;
`;

export const FormRow = styled.div`
  display: flex;
  justify-content: ${(props) => props.justifyContent || 'space-between'};
  align-items: center;
  margin: ${(props) => props.margin || '1rem 2rem'};
`;

export const FormColumn = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: start;
  width: 100%;

  &:first-of-type {
    margin-right: ${(props) => props.hasMargin && '1rem'};
  }

  &:larst-of-type {
    margin-left: ${(props) => props.hasMargin && '1rem'};
  }
`;

export const TextArea = styled.textarea`
  vertical-align: top;
  margin: 0;
  outline: 0;
  box-shadow: 0 0 0 0 transparent inset;
  transition: color .1s ease,border-color .1s ease;
  font-size: 14px;
  resize: vertical;
  width: 100%;
  overflow: auto;
  flex-direction: column;
  cursor: text;
  white-space: pre-wrap;
  word-wrap: break-word;

  text-rendering: auto;
  letter-spacing: normal;
  word-spacing: normal;
  text-transform: none;
  text-indent: 0px;
  text-shadow: none;
  display: inline-block;
  text-align: start;
  margin: 0em;
  font-weight: 400;

  line-height: 1.29;
  letter-spacing: 0.5px;
  text-align: left;
  color: #cbccce;

  border-radius: 3px;
  border: solid 1px #cbccce;
  background-color: #fbfbfb;
  
  opacity: 0.7;
`;

export const MapContainer = styled.div`
  display: flex;
  width: 100%;
  height: 32rem;
  background: #000000;
  margin-bottom: 20px;
  > div {
    flex: 1;
  }
`;

export const Checkbox = styled(MuiCheckbox)`
  svg {
    color: ${(props) => props.checked ? '#FF4242' : 'hsla(220, 2%, 72%, 1.0)'};
  }
`;

export const Label = styled(FormControlLabel)`
  margin-bottom: 0;
  
  span {
    color: hsla(220, 2%, 52%, 1.0);
    font-family: 'Source Sans Pro',Georgia,Times,'Times New Roman',serif;
  }

  &.disabled,
  &[disabled] {
    span {
      color: hsla(0, 0%, 75%, 1.0);
    }
  }
`;
