import styled from 'styled-components';

const TablePaginationSection = styled.div`
  display: flex;
  justify-content: space-between;
  .table-pagination {
    list-style-type: none;
    display: flex;
    padding: 0;
    color: #818d98;
  }
  .page {
    border-right: 0;
    
    &:nth-last-child(2) {
      a {
        border-right: 1px solid #d4d4d9;
      }
    }
  }
  .page {
    a {
      display: block;
      cursor: pointer;
      padding: 1px 10px;
      border: 1px solid #d4d4d9;
      border-right: 0;
      font-size: 13px;
    }
  }
  .break {
    border: 1px solid #d4d4d9;
    border-right: none;
    padding: 5px 10px;
  }
  .previous {
    cursor: pointer;
    a {
      display: block;
      padding: 1px 10px;
      border: 1px solid #d4d4d9;
      border-right: none;
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
      font-size: 13px;
    }
  }
  .next {
    cursor: pointer;
    a {
      display: block;
      padding: 1px 10px;
      border: 1px solid #d4d4d9;
      border-left: none;
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
      font-size: 13px;
    }
  }
  .selected {
    color: white;
    a {
      box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0), 0 1px 4px 0 rgba(0, 0, 0, 0.2);
      background-color: #ed2324;
      font-size: 13px;
      border: 1px solid #ed2324;
      &:focus {
        outline: none;
      }
    }
  }
  .disabled {
    display: none;
  }
`;

export default TablePaginationSection;
