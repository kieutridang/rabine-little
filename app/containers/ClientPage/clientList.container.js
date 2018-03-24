// vendor
import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { makeGetClients } from './client.selectors';
import FilterableTable from '../../components/FilterTable';
import { actions } from './client.reducer';

const renderFunctions = () => (<span>⋮</span>);

const fields = [
  { name: 'name', displayName: 'Client Name', inputFilterable: true, sortable: true },
  { name: 'contactName', displayName: 'Contact Name', inputFilterable: true, sortable: false },
  { name: 'phone', displayName: 'Phone', inputFilterable: true, sortable: false },
  { name: 'email', displayName: 'Email', inputFilterable: true, sortable: false },
  { name: 'activeSites', displayName: 'Active Sites', inputFilterable: false, sortable: false },
  { name: '', displayName: ' ', inputFilterable: false, sortable: false, render: renderFunctions },
];

class ClientListContainer extends React.Component { // eslint-disable-line react/prefer-stateless-function
  componentWillMount() {
    this.props.getClientsRequest();
  }

  render() {
    const { clients = [] } = this.props;
    const data = clients;

    return (
      <FilterableTable
        namespace="People"
        initialSort="name"
        data={data}
        fields={fields}
        noRecordsMessage="There are no client to display"
        noFilteredRecordsMessage="No client data match your filters!"
        topPagerVisible={false}
        headerVisible={false}
      />);
  }
}

ClientListContainer.propTypes = {
  getClientsRequest: PropTypes.func,
  clients: PropTypes.arrayOf(PropTypes.object),
};

const mapStateToProps = createStructuredSelector({
  clients: makeGetClients(),
});

const mapDispatchToProps = (dispatch) => ({
  getClientsRequest: (filter) => dispatch(actions.getClientsRequest(filter)),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withConnect,
)(ClientListContainer);
