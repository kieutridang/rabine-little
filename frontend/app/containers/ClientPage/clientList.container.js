// vendor
import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Link } from 'react-router-dom';
import { makeGetClientsWithFilters } from '../../appSelector/client';
import FilterableTable from '../../components/FilterTable';
import { actions } from '../../appReducer/client.reducer';
import ClientListDropdownMenu from './clientList.dropdown';


const renderName = (props) => {
  const id = props.record.id;
  return (
    <Link to={`clients/${id}/design`}>{props.record.name}</Link>
  );
};

renderName.propTypes = {
  record: PropTypes.obj,
};

class ClientListContainer extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

    this.fields = [
      { name: 'name', displayName: 'Client Name', inputFilterable: true, sortable: true, render: renderName },
      { name: 'contactName', displayName: 'Contact Name', inputFilterable: true, sortable: true },
      { name: 'phone', displayName: 'Phone', inputFilterable: true, sortable: true },
      { name: 'email', displayName: 'Email', inputFilterable: true, sortable: true },
      { name: 'activeSites', displayName: 'Active Sites', inputFilterable: false, sortable: true },
      {
        name: '',
        displayName: ' ',
        inputFilterable: false,
        sortable: false,
        render: (prop) => this.renderFunctions({
          ...prop,
          deleteClientRequest: this.props.deleteClientRequest,
        }),
      },
    ];
  }

  componentWillMount() {
    this.props.getClientsRequest();
  }

  renderFunctions = (props) => <ClientListDropdownMenu {...props} />;

  render() {
    const { clients = [] } = this.props;
    const data = [...clients];

    return (
      <FilterableTable
        namespace="People"
        initialSort="name"
        data={data}
        fields={this.fields}
        noRecordsMessage="There are no client to display"
        noFilteredRecordsMessage="No client data match your filters!"
        topPagerVisible={false}
        headerVisible={false}
      />);
  }
}

ClientListContainer.propTypes = {
  getClientsRequest: PropTypes.func,
  deleteClientRequest: PropTypes.func,
  clients: PropTypes.arrayOf(PropTypes.object),
};

const mapStateToProps = createStructuredSelector({
  clients: makeGetClientsWithFilters(),
});

const mapDispatchToProps = (dispatch) => ({
  getClientsRequest: (filter) => dispatch(actions.getClientsRequest(filter)),
  deleteClientRequest: (clientId) => dispatch(actions.deleteClientRequest(clientId)),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withConnect,
)(ClientListContainer);
