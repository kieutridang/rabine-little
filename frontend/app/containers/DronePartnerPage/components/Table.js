import styled from 'styled-components';

const TableWrapper = styled.div`
  margin-top: 10px;
  table {
    width: 100%;
    font-size: 14px;
    letter-spacing: 0.7px;
    color: #323232;
    thead {
      tr {
        background-color: #ffffff;
        border: solid 1px #eeeeee;
        th {
          text-transform: uppercase; 
          padding: 14px 23px;
          opacity: 0.4;
          letter-spacing: 0.8px;
          text-align: left;
          &.sort-active {
            opacity: 0.9;
          }
        }
      }
    }
    div.empty-state {
      width: 100%;
      background-color: #ffffff;
    }
    tbody {
      tr {
        background-color: #ffffff;
        border: solid 1px #eeeeee;
        td {
          padding: 12px 23px;
          a {
            color: #71acdd;
            letter-spacing: 0.8px;
            text-decoration: none;
            &:hover {
              text-decoration: underline;
            }
          }
        }
      }
    }
  }
`;

export default TableWrapper;
