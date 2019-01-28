import styled from 'styled-components';

export const FormSubtitle = styled.div`
    text-align: left;
    margin-top: ${(props) => props.hasMargin && '2.2rem'};
    width: 100%;
    height: 2.6rem;
    background-color: hsl(0, 0%, 2%);

    div {
        color: white;
        text-transform: uppercase;
        margin-top: 0.6rem;
        margin-left: 1.4rem;
    }
`;
