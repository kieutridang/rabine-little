// vendor
import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { makeGetSites } from './site.selectors';
import FilterableTable from '../../components/FilterTable';
import { actions } from './site.reducer';

const renderFunctions = () => (<span>⋮</span>);

const fields = [
  { name: 'name', displayName: 'Site Name', sortable: true },
  { name: 'deadline', displayName: 'Completed', sortable: true },
  { name: 'cost', displayName: 'Cost', sortable: true },
  { name: 'sqFoot', displayName: 'Total SQ.FT.', sortable: true },
  { name: 'droneCost', displayName: 'Total Repairs', sortable: true },
  { name: '', displayName: ' ', inputFilterable: false, sortable: false, render: renderFunctions },
];

class SiteListContainer extends React.Component { // eslint-disable-line react/prefer-stateless-function
  componentWillMount() {
    this.props.getSitesRequest();
  }

  render() {
    const { sites = [] } = this.props;
    const data = sites;

    return (
      <FilterableTable
        namespace="site"
        initialSort="name"
        data={data}
        fields={fields}
        noRecordsMessage="There are no data to display"
        noFilteredRecordsMessage="No data match your filter!"
        topPagerVisible={false}
        headerVisible={false}
      />
    );
  }
}

SiteListContainer.propTypes = {
  getSitesRequest: PropTypes.func,
  sites: PropTypes.arrayOf(PropTypes.object),
};

const mapStateToProps = createStructuredSelector({
  sites: makeGetSites(),
});

const mapDispatchToProps = (dispatch) => ({
  getSitesRequest: (filter) => dispatch(actions.getSitesRequest(filter)),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withConnect,
)(SiteListContainer);
