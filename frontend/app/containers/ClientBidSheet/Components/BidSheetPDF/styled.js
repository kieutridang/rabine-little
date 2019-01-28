import styled from 'styled-components';

export const Wrapper = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const DocumentWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  iframe {
      width: 100%;
      height: 80%;
  }
`;
