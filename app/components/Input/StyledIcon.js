import styled from 'styled-components';

const StyledLeftIcon = styled.div`
  cursor: default;
  position: absolute;
  line-height: 1;
  text-align: center;
  top: 0;
  left: 0;
  margin: 0;
  height: 100%;
  width: 2.67142857em;
  opacity: .5;
  border-radius: .28571429rem 0 0 .28571429rem;
  transition: opacity .3s ease;
  
  display: inline-block;
  font-style: normal;
  font-weight: 400;
  text-decoration: inherit;
  speak: none;
  font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;

  ${(props) => props.icon && `background: url(${props.icon}) no-repeat center center;`}
`;

export default StyledLeftIcon;
