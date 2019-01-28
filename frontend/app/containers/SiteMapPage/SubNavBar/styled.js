import styled from 'styled-components';

export const DropdownContent = styled.div`
  position: absolute;
  top: 10px;
  right: ${(props) => props.sideBarOpen ? '22.75rem' : '4rem'};
  z-index: 1000;
  width: auto;
  background-color: hsla(0, 0%, 14%, 0.75);
  color: hsla(360, 100%, 100%, 0.6);

  select {
    padding: 0.70rem 0.60rem;
    border-radius: 4px;
    line-height: 1.5;
    width: 100%;
    font-size: 1.2rem;
    &:focus {
      outline: none;
      border-color: hsla(220, 3%, 80%, 1.0);
    }

    option {
      background-color: hsla(0, 0%, 14%, 0.75);
      color: hsla(360, 100%, 100%, 0.6);
      text-shadow: 0 1px 0 rgba(0, 0, 0, 0.4);
    }
  }

`;
