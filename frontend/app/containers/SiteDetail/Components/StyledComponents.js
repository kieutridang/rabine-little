import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const AddButton = styled.button` background: #EA272E;
  width: 100%;
  color: #FFFFFF;
  font-size: 16px;
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
  padding: 0px 0px;
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
  margin-top: 0px;
  margin-bottom: 13px;
  label {
    text-transform: uppercase;
    justify-content: flex-start;
  }
  span {
    font-size: 10px;
    font-weight: 600;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: 0.4px;
    text-align: left;
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
    text-align: left;
    color: #707277;
    padding-left: 15px;
    padding-right: 15px;
    
    ::placeholder {
      opacity: 0.7;
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

export const SiteLink = styled(Link)`
  text-decoration: none;
  &:hover {
    text-decoration: none;
  }
`;

export const SiteName = styled.div`
  display: block;
  font-size: 1.0rem;
  color: hsla(208, 61%, 57%, 1.0);
`;

export const SiteAddress = styled.div`
  display: block;
  color: hsla(0, 0%, 50%, 1.0);
`;
