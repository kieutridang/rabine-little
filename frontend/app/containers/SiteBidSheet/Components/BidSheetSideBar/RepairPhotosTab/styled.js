import styled from 'styled-components';

export const RepairPhotosWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
`;

export const RepairPhoto = styled.div`
    align-self: center;
    margin-top: 2.5rem;
    max-width: 40%;
    p {
        font-weight: 600;
        line-height: normal;
        letter-spacing: normal;
        font-size: 1rem;
        margin-bottom: 15px;
        font-size: 0.75rem;
    }

    @media (max-width:767px) {
        flex-basis: calc(50% - 12px);
    }
      
    @media (max-width:460px) {
        flex-basis: 100%;
    }
`;


export const PhotoWrapper = styled.img`
  object-fit: cover;
  width: 175px;
  height: 175px;
  border-radius: 10px;
  border: 2px #dfdfdf solid;
  border-radius: 10px;
`;
