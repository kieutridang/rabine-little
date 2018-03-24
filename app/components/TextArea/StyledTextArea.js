// vendor
import styled, { css } from 'styled-components';

// app
import { borderStyle } from '../../utils/styles/border';
import { paddingStyle } from '../../utils/styles/boxModel';

const StyledTextArea = styled.textarea`
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
  background-color: ${(props) => props.backgroundColor};
  
  opacity: 0.7;

  ${(props) => (props.padding && paddingStyle(props.padding)) || css`padding: 11px 15px;`}
  ${(props) => (props.border && borderStyle(props.border)) || css`border: solid 1px #cbccce;`}
`;

export default StyledTextArea;
