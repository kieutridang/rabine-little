// vendor
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';
import 'ag-grid-enterprise';

// app
import LoadingIndicator from '../../components/LoadingIndicator';
import { makeSelectIsLoading } from '../../appSelector/siteRepairs';
import { limitDecimals } from '../../utils/number/numberUtils';
import SiteRepairListDropdown from './siteRepairList.dropdown';

class SiteRoofingRepairPanel extends Component {
  onGridReady = (params) => {
    this.gridApi = params.api;

    this.gridApi.sizeColumnsToFit();
    this.gridApi.addAggFunc('aggSum', this.sumTotalColumn);
    this.gridApi.setSortModel([{
      colId: 'ag-Grid-AutoColumn',
      sort: 'asc',
    }]);
  };

  onFilterChanged = () => {
    const { onFilter } = this.props;
    if (onFilter && this.gridApi) {
      const exportData = [];
      this.gridApi.forEachNodeAfterFilterAndSort((rowNode) => {
        const { data } = rowNode;
        if (data) {
          exportData.push({ ...data });
        }
      });

      onFilter(exportData, 'repair');
    }
  }

  sumTotalColumn = (values) => limitDecimals(values.reduce((accu, cur) => parseFloat(accu) + parseFloat(cur || 0.0), 0.0));

  qtyFormatter = ({ value }) => limitDecimals(parseFloat(value || 0.0));

  render() {
    const { repairs, isLoading, siteId } = this.props;
    const data = repairs ? [...repairs.map((repairItem) => ({ ...repairItem, siteId }))] : [];

    return isLoading ? <LoadingIndicator /> :
      (<div
        className="ag-theme-material"
        style={{ height: 600, boxSizing: 'border-box', marginTop: '1.5rem' }}
      >
        <AgGridReact
          onGridReady={this.onGridReady}
          onFilterChanged={this.onFilterChanged}
          toolPanelSuppressPivotMode
          suppressRowClickSelection
          rowSelection="multiple"
          enableColResize
          enableSorting
          enableFilter
          floatingFilter
          pagination
          paginationPageSize={100}

          rowData={data}
          pivotMode={false}
          suppressAggFuncInHeader
          aggFuncs={{
            aggSum: this.sumTotalColumn,
          }}
        >
          <AgGridColumn
            field="title"
            headerName="REPAIR SCOPE"
            suppressMenu
          />
          <AgGridColumn
            field="repairType"
            headerName="REPAIR TYPE"
            suppressMenu
          />
          <AgGridColumn
            field="area"
            headerName="AREA"
            suppressMenu
          />
          <AgGridColumn
            field="year"
            headerName="YEAR"
            suppressMenu
            rowGroup
            enableRowGroup
            hide
            sort="asc"
          />
          <AgGridColumn
            field="typeOfRepair"
            headerName="TYPE OF REPAIR"
            suppressMenu
          />
          <AgGridColumn
            field="defectType"
            headerName="DEFECT TYPE"
            suppressMenu
          />
          <AgGridColumn
            field="zone"
            headerName="ZONE"
            suppressMenu
          />
          <AgGridColumn
            width={60}
            suppressFilter
            suppressResize
            suppressSorting
            suppressMenu
            headerName="ACTION"
            pinned="right"
            cellRendererFramework={SiteRepairListDropdown}
          />
        </AgGridReact>
      </div>
    );
  }
}

SiteRoofingRepairPanel.propTypes = {
  repairs: PropTypes.array,
  isLoading: PropTypes.bool,
  siteId: PropTypes.string,
  onFilter: PropTypes.func,
};

SiteRoofingRepairPanel.defaultProps = {
  repairs: [],
};

const mapStateToProps = createStructuredSelector({
  isLoading: makeSelectIsLoading(),
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(SiteRoofingRepairPanel);
