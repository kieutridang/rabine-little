
import styled from 'styled-components';

export const AnnotationLoader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 250px;
  right: 0;
  bottom: 0;
  z-index: 1900;
  margin: auto;
  width: 13rem;
  height: 2.1rem;
  background: hsla(0, 0%, 10%, 1.0);
  border-radius: 4px;
  color: white;
`;

export const Wrapper = styled.div`
  display: flex;
  position: fixed;
  top: 54px;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;

  user-select: none;

  &.full {
    top: 0;
    .map-controls {
      top: 0;
    }
  }

  & > div,
  & > div > div {
    flex: 1;
    display: flex;
  }
`;

export const Toolbar = styled.div`
  position: absolute;
  z-index: 10000000;
  right: 50px;
  top: 10px;

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.2rem 0.6rem;
    border-radius: 3px;
    background-color: hsla(0, 0%, 10%, 1.0);
    color: hsla(0, 0%, 96%, 1.0);
    cursor: pointer;

    &:active {
      background-color: hsl(60, 4%, 25%);
      outline: none;
    }

    &:focus {
      outline: none;
    }

    &.primary {
      background-color: hsla(3, 70%, 53%, 1.0);
    }

    & + button {
      margin-left: 0.3rem;
    }
  }
`;

export const MapViewWrapper = styled.div`
  width: 55%;
  min-height: 500px;
  padding-left: 40px;
  margin: 120px auto 100px auto;
  > div {
    min-height: 500px;
  }
`;
