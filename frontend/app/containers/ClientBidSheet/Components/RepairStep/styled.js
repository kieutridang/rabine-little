import styled from 'styled-components';

export const RepairContainer = styled.div`
    display: grid;
    height: 100%;
    grid-template-rows: 0.3fr 1fr;
    grid-template-columns: 100%;
    grid-template-areas: "textInput"
                         "tableFilter"
`;

export const InputContainer = styled.div`
    grid-area: textInput;   
`;

export const TableFilterContainer = styled.div`
    grid-area: tableFilter;
    width: 80%;
    margin: 0 auto;
`;

export const Subtitle = styled.span`
    text-transform: uppercase;
    font-size: 10px;
    font-weight: 600;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: 0.4px;
    color: #707277;
    margin-bottom: 15px;
`;
