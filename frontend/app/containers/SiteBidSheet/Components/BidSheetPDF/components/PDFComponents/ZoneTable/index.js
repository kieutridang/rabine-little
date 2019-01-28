import React from 'react';
import PropTypes from 'prop-types';
import {
    Table,
    Row,
    Cell,
    HeaderRow,
    HeaderCell,
} from '../index';


const ZoneTable = ({
    checkboxes,
    zones,
}) => (
  <Table>
    <HeaderRow>
      <HeaderCell>
        Color
      </HeaderCell>
      { checkboxes.name ? <HeaderCell> Zone </HeaderCell> : null }
      { checkboxes.pci ? <HeaderCell> PCI </HeaderCell> : null }
      { checkboxes.area ? <HeaderCell grow={1.5}> TOTAL SF </HeaderCell> : null }
      { checkboxes.surfaceType ? <HeaderCell grow={1.5}> Surface </HeaderCell> : null }
    </HeaderRow>

    { zones.map((zone) => {
      const pci = +zone.pci;
      const area = +zone.area;
      // ATENTION: LEAVE CELLS ORDERED IN THIS WAY, ALL IN ONE LINE IT WILL TROW A HYPHENATION ERROR
      return (
        <Row key={zone.id}>
          <Cell color={zone.color} />
          { checkboxes.name ?
            <Cell>
              {zone.title || 'none'}
            </Cell>
          : null }
          { checkboxes.pci ?
            <Cell>
              {pci.toLocaleString() || 'none'}
            </Cell>
          : null }
          { checkboxes.area ?
            <Cell grow={1.5}>
              {`${area.toLocaleString()}` || 'none'}
            </Cell>
          : null }
          { checkboxes.surfaceType ?
            <Cell grow={1.5}>
              {zone.surfaceType || 'none'}
            </Cell>
          : null }
        </Row>
      );
    })}

  </Table>
  );

ZoneTable.propTypes = {
  checkboxes: PropTypes.any,
  zones: PropTypes.array,
};

export default ZoneTable;
