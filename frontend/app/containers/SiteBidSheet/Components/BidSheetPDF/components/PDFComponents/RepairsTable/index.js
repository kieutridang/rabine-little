import React from 'react';
import PropTypes from 'prop-types';

import {
    Table,
    Row,
    Cell,
    HeaderRow,
    HeaderCell,
} from '../index';


const TableRepairs = ({ checkboxes, repairs }) => (
  <Table>
    <HeaderRow>
      <HeaderCell>Color</HeaderCell>
      { checkboxes.repair ? <HeaderCell>Name</HeaderCell> : null }
      { checkboxes.qty ? <HeaderCell>qty</HeaderCell> : null }
      { checkboxes.units ? <HeaderCell>unit</HeaderCell> : null }
      { checkboxes.type ? <HeaderCell>Type</HeaderCell> : null }
      { checkboxes.unitPrice ? <HeaderCell>Unit price</HeaderCell> : null}
      { checkboxes.total ? <HeaderCell>Total</HeaderCell> : null }
      { checkboxes.zone ? <HeaderCell>Zone</HeaderCell> : null }
    </HeaderRow>
    {
      repairs.map((repair) => {
        const qty = +repair.qty;
        const unitPrice = +repair.unitPrice;
        const total = +repair.total;
        // ATENTION: LEAVE CELLS ORDERED IN THIS WAY, ALL IN ONE LINE IT WILL TROW A HYPHENATION ERROR
        return (
          <Row key={repair.id}>
            <Cell color={repair.color} />
            { checkboxes.repair ?
              <Cell>
                {repair.title}
              </Cell>
              : null }
            { checkboxes.qty ?
              <Cell>
                {qty.toLocaleString()}
              </Cell>
            : null }
            { checkboxes.units ?
              <Cell>
                {repair.unit}
              </Cell>
              : null }
            { checkboxes.type ?
              <Cell>
                {repair.repairType || 'Not set'}
              </Cell>
              : null }
            { checkboxes.unitPrice ?
              <Cell>
                {unitPrice.toLocaleString()}
              </Cell>
              : null }
            { checkboxes.total ?
              <Cell>
                {Math.round(total).toLocaleString()}
              </Cell>
              : null }
            { checkboxes.zone ?
              <Cell>
                {repair.zone}
              </Cell>
              : null }
          </Row>
        );
      })
    }
  </Table>
);

TableRepairs.propTypes = {
  checkboxes: PropTypes.any,
  repairs: PropTypes.any,
};

export default TableRepairs;
