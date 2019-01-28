// vendor
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';
import 'ag-grid-enterprise';

// app
import LoadingIndicator from '../../components/LoadingIndicator';
import { makeSelectIsLoading, makeSelectEdittingRepairId } from '../../appSelector/siteRepairs';
import { actions as siteRepairActions } from '../../appReducer/siteRepairs.reducer';
import { dollarFormatter, limitDecimals } from '../../utils/number/numberUtils';
import SiteRepairListDropdown from './siteRepairList.dropdown';

class SitePavementRepairPanel extends React.Component {
  onGridReady = (params) => {
    this.gridApi = params.api;

    this.gridApi.sizeColumnsToFit();
    this.gridApi.addAggFunc('aggSum', this.sumTotalColumn);
    this.gridApi.setSortModel([{
      colId: 'ag-Grid-AutoColumn',
      sort: 'asc',
    }]);
  };

  onCellValueChanged = (params) => {
    const { oldValue, newValue, data } = params;
    const { setSiteRepairsUnitPrice, siteId } = this.props;

    if (data && setSiteRepairsUnitPrice && oldValue !== newValue) {
      const { id, qty } = data;
      setSiteRepairsUnitPrice({ featureId: id, unitPrice: newValue, siteId, qty: parseInt(qty, 10) });
    }
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

  renderDollar = (params) => {
    const { value } = params;
    return value ? `$ ${dollarFormatter(Number(value))}` : '';
  };

  render() {
    const { repairs, isLoading, edittingRepairId, siteId } = this.props;
    const data = repairs ? [...repairs.map((repairItem) => ({ ...repairItem, siteId }))] : [];

    return isLoading ? <LoadingIndicator /> :
      (<div
        className="ag-theme-material"
        style={{ height: 600, boxSizing: 'border-box', marginTop: '1.5rem' }}
      >
        <AgGridReact
          onGridReady={this.onGridReady}
          onCellValueChanged={this.onCellValueChanged}
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
            headerName="TYPE OF REPAIR"
            suppressMenu
          />
          <AgGridColumn
            field="qty"
            headerName="QTY"
            filter="agNumberColumnFilter"
            valueFormatter={this.qtyFormatter}
            suppressMenu
            aggFunc="aggSum"
            enableValue
            allowedAggFuncs={['aggSum', 'count', 'first', 'last']}
          />
          <AgGridColumn
            field="unit"
            headerName="UNITS"
            suppressMenu
          />
          <AgGridColumn
            field="unitPrice"
            headerName="UNIT PRICE"
            filter="agNumberColumnFilter"
            valueFormatter={this.renderDollar}
            editable={!edittingRepairId}
            suppressMenu
          />
          <AgGridColumn
            field="total"
            headerName="TOTAL."
            filter="agNumberColumnFilter"
            valueFormatter={this.renderDollar}
            suppressMenu
            aggFunc="aggSum"
            enableValue
            allowedAggFuncs={['aggSum', 'count', 'first', 'last']}
            sort="asc"
          />
          <AgGridColumn
            field="zone"
            headerName="ZONE"
            suppressMenu
          />
          <AgGridColumn
            field="zoneLayerName"
            headerName="ZONE MAP"
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

SitePavementRepairPanel.propTypes = {
  repairs: PropTypes.array,
  isLoading: PropTypes.bool,
  setSiteRepairsUnitPrice: PropTypes.func,
  siteId: PropTypes.string,
  edittingRepairId: PropTypes.string,
  onFilter: PropTypes.func,
};

SitePavementRepairPanel.defaultProps = {
  repairs: [],
};

const mapStateToProps = createStructuredSelector({
  isLoading: makeSelectIsLoading(),
  edittingRepairId: makeSelectEdittingRepairId(),
});

const mapDispatchToProps = (dispatch) => ({
  setSiteRepairsUnitPrice: (payload) => dispatch(siteRepairActions.setSiteRepairsUnitPrice(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SitePavementRepairPanel);
