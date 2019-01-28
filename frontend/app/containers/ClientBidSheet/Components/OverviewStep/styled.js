import styled from 'styled-components';

export const OverviewContainer = styled.div`
    display: grid;
    height: 100%;
    grid-row-gap: 3rem;
    grid-template-rows: 40% 40%;
    grid-template-columns: 100%;
    grid-template-areas: "logos"
                         "inputs"
`;

export const LogoSelectorContainer = styled.div`
    grid-areas: logos; 
    display: grid;
    grid-template-rows: 100%;
    grid-template-columns: 50% 50%; 
    grid-template-areas: "rectangle rectangle"

`;

export const LogoSelector = styled.div`
    place-self: center;
    display: grid;
    grid-template-rows: 34px auto;
    grid-template-colums: 100%;
`;
export const LogoTitle = styled.span`
    color: #707277;
    font-size:14px;
`;

export const Rectangle = styled.div`
    width: 166px;
    height: 166px;
    border: 2px dashed rgba(151, 151, 151, .3);
    border-radius: 15px;
    display: grid;
    position: relative;
`;

export const SiteLogo = styled.div` 
    place-self: center;
`;
export const CompanyLogo = styled.div` 
    place-self: center;
`;

export const InputsContainer = styled.div`
    grid-areas: inputs;
`;

export const DeleteLogo = styled.div`
    position: absolute;
    right: -10px;
    top: -10px;
    width: 20px;
    height: 20px;
    background-color: #d8d8d8;
    border-radius: 50%;
    cursor: pointer;
    div {
        opacity: 0.2;
        font-size: 10px;
        margin: auto;
        width: 10px;
        height: 10px; 
        margin-top: 2px;
        margin-left: 6px;
    }
`;
