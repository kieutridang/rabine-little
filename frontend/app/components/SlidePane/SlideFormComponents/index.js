import styled from 'styled-components';

export const AddButton = styled.button`
  background: #EA272E;
  width: 100%;
  color: #FFFFFF;
  font-size: 16px;
  border-radius: 3px;
  padding: 10px 0;
  cursor: pointer;
  text-transform: uppercase;
  margin-top: 20px;
`;

export const Form = styled.form`
  margin-bottom: 1em;
  background: white;
  border-radius: 5px;
  text-align: center;
  padding: 0px 0px;
`;

export const Input = styled.input`
  height: 40px;
  width: 100%;
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
  > label {
    display: flex; 
    flex-direction: column;
    justify-content: flex-start;
    margin-top: 0px;
    margin-bottom: 13px;
    label {
      text-transform: uppercase;
      justify-content: flex-start;
    }
    span {
      text-transform: uppercase;
      font-size: 10px;
      font-weight: 600;
      font-style: normal;
      font-stretch: normal;
      line-height: normal;
      letter-spacing: 0.4px;
      text-align: left;
      color: #707277;
      display: flex;
      margin-bottom: 8px;
    }
    }
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
