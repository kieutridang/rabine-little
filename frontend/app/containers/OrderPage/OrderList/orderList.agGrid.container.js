// vendor
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';
import 'ag-grid-enterprise';

import { makeGetOrders, makeGetLoadingState } from '../../../appSelector/order';
import LoadingIndicator from '../../../components/LoadingIndicator';
import { actions } from '../../../appReducer/order.reducer';
import { statusOptions } from '../../Common/Options';
import OrderListDateRenderer from './orderList.dateRenderer';
import OrderListDateFilter from './orderList.dateFilter';
import OrderListNameRenderer from './orderList.nameRenderer';

class OrderGrid extends Component {
  // componentWillMount() {
    // TODO: temporary remove Orders feature
    // this.props.getOrdersRequest();
  // }

  onGridReady = (params) => {
    params.columnApi.autoSizeColumns();
  };

  getFilterStatusValues = () => statusOptions.map(({ value }) => value);

  getStatusFilterParams = () => ({
    suppressSorting: true,
    selectAllOnMiniFilter: true,
    values: this.getFilterStatusValues(),
    cellRenderer: this.renderFilterStatusValues,
  });

  transformOrderData = (orders) => {
    const transformedOrders = orders
      ? orders.map((order) => {
        const { dronePlan = {}, services = [] } = order;
        const { name: droneDeployName } = dronePlan;
        const serviceTypes = services
          .map(({ type }) => type)
          .reduce((accu, cur) => `${accu}${accu ? ', ' : ''}${cur}`, '');

        return { ...order, droneDeployName, serviceTypes };
      })
      : [];

    return transformedOrders;
  }

  renderFilterStatusValues = (params) => {
    const { value } = params;
    const statusIndex = statusOptions.findIndex((obj) => obj.value === value);
    return statusIndex !== -1 ? statusOptions[statusIndex].text : value;
  };

  render() {
    const { orders, isLoading } = this.props;
    const transformedOrders = this.transformOrderData(orders);
    return isLoading ? (
      <LoadingIndicator />
    ) : (
      <div
        className="ag-theme-material"
        style={{ height: 600, boxSizing: 'border-box' }}
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

          rowData={transformedOrders}
        >
          <AgGridColumn
            field="name"
            headerName="ORDER NAME"
            cellRendererFramework={OrderListNameRenderer}
            suppressMenu
          />
          <AgGridColumn
            field="address"
            headerName="ADDRESS"
            suppressMenu
          />
          <AgGridColumn
            field="project"
            headerName="PROJECT"
            suppressMenu
          />
          <AgGridColumn
            field="clientName"
            headerName="CLIENT NAME"
            suppressMenu
          />
          <AgGridColumn
            field="deadline"
            headerName="DEADLINE"
            cellRendererFramework={OrderListDateRenderer}
            filterFramework={OrderListDateFilter}
            suppressMenu
          />
          <AgGridColumn
            field="serviceTypes"
            headerName="SERVICE TYPE"
            suppressMenu
          />
          <AgGridColumn
            field="serviceCost"
            headerName="SERVICE COST"
            suppressMenu
          />
          <AgGridColumn
            field="rabineS3Folder"
            headerName="S3 FOLDER"
            suppressMenu
          />
          <AgGridColumn
            field="droneDeployName"
            headerName="DRONE DEPLOY PLAN"
            suppressMenu
          />
        </AgGridReact>
      </div>
    );
  }
}

OrderGrid.propTypes = {
  // getOrdersRequest: PropTypes.func,
  isLoading: PropTypes.bool,
  orders: PropTypes.arrayOf(PropTypes.object),
};

const mapStateToProps = createStructuredSelector({
  orders: makeGetOrders(),
  isLoading: makeGetLoadingState(),
});

const mapDispatchToProps = (dispatch) => ({
  getOrdersRequest: (filter) => dispatch(actions.getOrdersRequest(filter)),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default withConnect(OrderGrid);
