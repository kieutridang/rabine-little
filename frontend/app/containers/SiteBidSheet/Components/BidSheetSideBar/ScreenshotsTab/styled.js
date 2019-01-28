import styled from 'styled-components';

export const ScreenshotsWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
`;

export const ScreenshotContent = styled.div`
    align-self: center;
    margin-top: 2.5rem;
    margin-left: 1rem;
    p {
        font-weight: 600;
        line-height: normal;
        letter-spacing: normal;
        font-size: 1rem;
        margin-bottom: 15px;
    }

    @media (max-width:767px) {
        flex-basis: calc(50% - 12px);
    }
      
    @media (max-width:460px) {
        flex-basis: 100%;
    }
`;
