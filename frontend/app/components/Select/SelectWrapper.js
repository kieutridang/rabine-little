import styled from 'styled-components';

export const StyledSelect = styled.div`
  width: ${(props) => props.width || '12rem'};
  height: ${(props) => props.height || '2.6rem'};
  margin-left: 1.3125rem;

  .Select {
    height: 100%;
  }

  .Select-control {
    height: 100%;
    border: solid 1px #dedee1;
    border-radius: 3px;
  }

  .Select-placeholder {
    font-size: 0.875rem;
    letter-spacing: 0.8px;
    color: #b3bac0;
    font-weight: 400;
    opacity: 0.5;
  }
`;
