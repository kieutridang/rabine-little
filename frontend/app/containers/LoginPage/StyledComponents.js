import styled from 'styled-components';

export const Button = styled.button`
  background: #EA272E;
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
  padding: 40px 20px;
`;

export const Article = styled.article`
  width: 368px;
  margin: auto;
  margin-top: 8vh;
`;

export const Container = styled.div`
  position: relative;
`;

export const HighlightLink = styled.p`
  color: #ACAEB0;
  a {
    color: #EA272E;
  }
`;

export const ForgotPasswordLink = styled.p`
  font-size: 14px;
  text-align: right;
  a {
    color: #EA272E;
  }
`;

export const Input = styled.input`
  outline: none;
  border: 1px solid #ACAEB0;
  border-radius: 3px;
  padding: 10px;
  width: 100%;
  color: #ACAEB0;
`;

export const Logo = styled.img`
  width: 50%;
  src: ${(props) => props.src};
  margin-bottom: 40px;
`;

export const InputWrap = styled.div`
  margin-top: 12px;
  margin-bottom: 30px;
  &:last-child {
    margin-bottom: 20px;
  }
  label {
    text-transform: uppercase;
    position: relative;
  }
  span {
    position: absolute;
    font-size: 12px;
    top: -35px;
    color: #ACAEB0;
  }
`;

export const ErrorMessage = styled.p`
  text-transform: none;
  color: #EA272E;
  text-align: ${(props) => props.align || 'right'};
  font-style: italic;
`;
