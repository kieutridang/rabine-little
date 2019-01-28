import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';
import { Link } from 'react-router-dom';

import { actions } from '../../appReducer/client.reducer';
import { makeGetClientsWithFilters } from '../../appSelector/client';
import ClientListDropdownMenu from './clientList.dropdown';

class ClientGrid extends Component {
  state = {
    quickFilterText: null,
    showToolPanel: false,
  }

  componentWillMount() {
    this.props.getClientsRequest();
  }

  onCellValueChanged = (params) => {
    const { oldValue, newValue, data, colDef } = params;
    const { field } = colDef;
    const { editClient } = this.props;

    if (data && editClient && oldValue !== newValue) {
      const clientRequest = {
        ...data,
        [field]: newValue,
      };

      editClient(clientRequest);
    }
  }

  onGridReady = (params) => {
    params.api.sizeColumnsToFit();
  };

  renderName = (params) => {
    const { name, id } = params.data;
    return <Link to={`clients/${id}/design`}>{name}</Link>;
  }

  render() {
    const { quickFilterText, showToolPanel } = this.state;
    const { clients } = this.props;

    return (
      <div
        className="ag-theme-material"
        style={{ height: 600, overflow: 'hidden' }}
      >
        <AgGridReact
          onGridReady={this.onGridReady}

          showToolPanel={showToolPanel}
          quickFilterText={quickFilterText}

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

          rowData={clients}
          onCellValueChanged={this.onCellValueChanged}
        >
          <AgGridColumn
            checkboxSelection
            headerCheckboxSelection
            headerCheckboxSelectionFilteredOnly
            width={50}
            suppressSorting
            suppressMenu
            suppressFilter
            pinned="left"
            headerName="CHECKBOXES"
          />
          <AgGridColumn
            field="name"
            filter="agTextColumnFilter"
            headerName="NAME"
            cellRendererFramework={this.renderName}
            suppressMenu
            editable
          />
          <AgGridColumn
            field="contactName"
            filter="agTextColumnFilter"
            headerName="CONTACT NAME"
            suppressMenu
            editable
          />
          <AgGridColumn
            field="phone"
            filter="agTextColumnFilter"
            headerName="PHONE"
            suppressMenu
            editable
          />
          <AgGridColumn
            field="email"
            filter="agTextColumnFilter"
            headerName="EMAIL"
            suppressMenu
            editable
          />
          <AgGridColumn
            field="activeSites"
            filter="agNumberColumnFilter"
            headerName="ACTIVE STEPS"
            suppressMenu
          />
          <AgGridColumn
            headerName="ACTION"
            width={50}
            suppressMenu
            suppressFilter
            suppressSorting
            cellRendererFramework={ClientListDropdownMenu}
            pinned="right"
          />
        </AgGridReact>
      </div>
    );
  }
}

ClientGrid.propTypes = {
  getClientsRequest: PropTypes.func,
  clients: PropTypes.arrayOf(PropTypes.object),
  editClient: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  clients: makeGetClientsWithFilters(),
});

const mapDispatchToProps = (dispatch) => ({
  getClientsRequest: (filter) => dispatch(actions.getClientsRequest(filter)),
  editClient: (client) => dispatch(actions.editClientRequest(client)),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default withConnect(ClientGrid);
