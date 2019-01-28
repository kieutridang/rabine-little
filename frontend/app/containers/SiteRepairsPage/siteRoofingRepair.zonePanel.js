// vendor
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';
import 'ag-grid-enterprise';

// app
import LoadingIndicator from '../../components/LoadingIndicator';
import { makeSelectIsLoading } from '../../appSelector/zones';
import { limitDecimals } from '../../utils/number/numberUtils';

class SiteRoofingZonePanel extends Component {
  onGridReady = (params) => {
    params.api.sizeColumnsToFit();
  };

  render() {
    const { zones, isLoading } = this.props;
    const data = zones ? [...zones] : [];

    const standardizedData = data.map((zone) => {
      const { area } = zone;
      return { ...zone, area: parseInt(limitDecimals(parseFloat(area || 0.0)), 10) };
    });

    return isLoading ? <LoadingIndicator /> : (
      <div
        className="ag-theme-material"
        style={{ height: 600, boxSizing: 'border-box', marginTop: '1.5rem' }}
      >
        <AgGridReact
          onGridReady={this.onGridReady}

          toolPanelSuppressPivotMode
          toolPanelSuppressRowGroups
          toolPanelSuppressValues
          toolPanelSuppressPivots

          suppressRowClickSelection
          rowSelection="multiple"
          enableColResize
          enableSorting
          enableFilter
          floatingFilter
          pagination
          paginationPageSize={100}

          rowData={standardizedData}
        >
          <AgGridColumn
            field="title"
            headerName="ZONE NAME"
            suppressMenu
            sort="asc"
          />
          <AgGridColumn
            field="type"
            headerName="ZONE TYPE"
            suppressMenu
            sort="asc"
          />
          <AgGridColumn
            field="zoneSubType"
            headerName="ZONE SUB TYPE"
            suppressMenu
            sort="asc"
          />
          <AgGridColumn
            field="area"
            headerName="AREA"
            filter="agNumberColumnFilter"
            suppressMenu
          />
          <AgGridColumn
            field="rating"
            headerName="ZONE RATING"
            filter="agNumberColumnFilter"
            suppressMenu
          />
        </AgGridReact>
      </div>
    );
  }
}

SiteRoofingZonePanel.propTypes = {
  zones: PropTypes.array,
  isLoading: PropTypes.bool,
};

SiteRoofingZonePanel.defaultProps = {
  zones: [],
};

const mapStateToProps = createStructuredSelector({
  isLoading: makeSelectIsLoading(),
});

const withRedux = connect(mapStateToProps, null);

export default compose(
  withRedux,
)(SiteRoofingZonePanel);
