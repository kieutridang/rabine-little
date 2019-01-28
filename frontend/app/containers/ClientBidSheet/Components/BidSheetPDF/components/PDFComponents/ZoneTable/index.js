import React from 'react';
import PropTypes from 'prop-types';

import { Table, HeaderRow, HeaderCell } from '../index';

const ZoneTable = ({ checkboxes }) => (
  <Table>
    <HeaderRow>
      <HeaderCell>
        Color
      </HeaderCell>
      {checkboxes.name ? <HeaderCell>Zone</HeaderCell> : null}
      {checkboxes.pci ? <HeaderCell>PCI</HeaderCell> : null}
      {checkboxes.area ? <HeaderCell>Total SF</HeaderCell> : null}
      {checkboxes.surfaceType ? <HeaderCell>Surface</HeaderCell> : null}
    </HeaderRow>
  </Table>
);

ZoneTable.propTypes = {
  checkboxes: PropTypes.any,
};
export default ZoneTable;
