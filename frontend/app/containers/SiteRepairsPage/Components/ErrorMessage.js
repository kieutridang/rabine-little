import styled from 'styled-components';

export const ErrorMessage = styled.p`
    font-size: 14px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.29;
    letter-spacing: 0.5px;
    
    text-transform: none;
    color: #EA272E;
    text-align: ${(props) => props.align || 'right'};
    margin: 4px 0;
`;
