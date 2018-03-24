import { Link } from 'react-router-dom';
import styled from 'styled-components';

export default styled(Link)`
  font-size: 0.6rem;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: center;

  color: hsla(0, 0%, 100%, 1.0);
  text-decoration: none;

  &:hover,
  &.active {
    color: hsla(0, 0%, 80%, 1.0);
    text-decoration: none;
  }
`;
