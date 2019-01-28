import { Link } from 'react-router-dom';
import styled from 'styled-components';

export default styled(Link) `
  font-size: 0.9325rem;
  font-weight: 600;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: 0.5px;
  text-align: center;
  color: ${(p) => p.color || '#444444'};
  text-decoration: none;
  &:hover {
    text-decoration: none;
    color: ${(p) => p.hoverColor || 'hsla(3, 70%, 53%, 1.0)'};
  }
`;
