import styled from 'styled-components';

const backgroundColor = '#ffffff';

export const DetailWrapper = styled.div`
  width: 100%;
  overflow: scroll;
`;

export const DetailHeader = styled.div`
  width: 100%;
  padding: 20px 80px;
  background-color: #ffffff;
  border: solid 1px #efeff1;
  text-align: left;
  color: #545558;
  display: grid;
  grid-template-areas: "title stepper";
  grid-template-columns: 250px 1fr;
`;

export const DetailContent = styled.div`
  display: grid;
  width: 100%;
  height: 100vh;
  grid-template-areas:  "detail note note"
                        "detail activity activity";
  grid-template-columns: 1fr 2fr;
  grid-column-gap: 5rem;
  padding: 1.25rem 5rem;
`;

// DETAIL SECTION
export const DetailInfo = styled.section`
  grid-area: detail;
  background: ${backgroundColor};
  display: grid;
  grid-template-areas:
    "title"
    "info";
  grid-template-rows: 66px 1fr;
  border: 1px solid #efeff1;
  max-height: 700px;
`;

export const TitleDetail = styled.div`
  grid-area: title;
  padding: 20px 32px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #efeff1;
`;

export const EditButton = styled.button`
  cursor: pointer;
  img {
    width: 20px;
    height: 20px;
  }
  &:focus {
    outline: none;
  }
  svg {
    width: 1.6rem;
    height: 1.6rem;
  }
`;


// NOTE SECTION
export const Note = styled.section`
  grid-area: note;
  position: relative;
  font-size: 12px;
`;

export const EditorWrapper = styled.div`
  height: 100%;
  padding: 16px 24px 48px 24px;
`;

export const EditorButton = styled.div`
  position: absolute;
  left: 14px;
  bottom: 20px;

  .primary {
    color: #ffffff;
    width: 66px;
    height: 29px;
    border-radius: 3px;
    background-color: #ed2324;
    margin: 5px;
    cursor: pointer;
    &.disabled {
      cursor: not-allowed;
      opacity: 0.3;
    }
  }

  .secondary {
    width: 75px;
    height: 29px;
    opacity: 0.3;
    border-radius: 3px;
    border: solid 1px #454545;
    color: #373737;
    margin: 5px;
  }
`;

// ACTIVITY SECTION
export const Activity = styled.section`
  grid-area: activity;
`;
