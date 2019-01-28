// vendor
import React from 'react';
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

class SitePavementZonePanel extends React.Component {
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
            field="layerName"
            headerName="ZONE MAP"
            suppressMenu
            sort="asc"
          />
          <AgGridColumn
            field="title"
            headerName="ZONE NAME"
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
            field="pci"
            headerName="PCI"
            filter="agNumberColumnFilter"
            suppressMenu
          />
          <AgGridColumn
            field="surfaceType"
            headerName="SURFACE TYPE"
            suppressMenu
          />
          <AgGridColumn
            field="trafficType"
            headerName="TRAFFIC TYPE"
            suppressMenu
          />
        </AgGridReact>
      </div>
    );
  }
}

SitePavementZonePanel.propTypes = {
  zones: PropTypes.array,
  isLoading: PropTypes.bool,
};

SitePavementZonePanel.defaultProps = {
  zones: [],
};

const mapStateToProps = createStructuredSelector({
  isLoading: makeSelectIsLoading(),
});

const withRedux = connect(mapStateToProps, null);

export default compose(
  withRedux,
)(SitePavementZonePanel);
