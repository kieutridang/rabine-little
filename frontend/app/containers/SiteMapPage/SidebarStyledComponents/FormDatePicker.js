import styled from 'styled-components';

export const FormDatePickerWrapper = styled.div`
    display: block;
    width: 100%;
    .SingleDatePicker {
        border-radius: 4px;
        justify-content: space-around;
        width: 100%;
        .SingleDatePickerInput {
            background-color: hsl(0, 0%, 19%);
            border: solid 1px hsl(0, 0%, 29%);
            height: 2.2rem;
        }
        .DateInput {
            input {
                height: 2rem;
                background-color: hsl(0, 0%, 19%);
            }
        }
    }
    .SingleDatePickerInput {
        margin: 0 !important;
    }
`;
