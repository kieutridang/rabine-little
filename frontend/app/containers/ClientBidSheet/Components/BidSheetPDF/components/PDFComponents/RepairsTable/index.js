import React from 'react';
import PropTypes from 'prop-types';

import { Table, HeaderRow, HeaderCell } from '../index';

const RepairsTable = ({ checkboxes }) => (
  <Table>
    <HeaderRow>
      <HeaderCell>Color</HeaderCell>
      {checkboxes.repair ? <HeaderCell>Name</HeaderCell> : null}
      {checkboxes.qty ? <HeaderCell>qty</HeaderCell> : null}
      {checkboxes.units ? <HeaderCell>unit</HeaderCell> : null}
      {checkboxes.type ? <HeaderCell>Type</HeaderCell> : null}
      {checkboxes.unitPrice ? <HeaderCell>Unit price</HeaderCell> : null}
      {checkboxes.total ? <HeaderCell>Total</HeaderCell> : null}
      {checkboxes.zone ? <HeaderCell>Zone</HeaderCell> : null}
    </HeaderRow>
  </Table>
);

RepairsTable.propTypes = {
  checkboxes: PropTypes.any,
};

export default RepairsTable;
