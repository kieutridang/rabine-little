// Vendor
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import moment from 'moment';
import { makeGetOrders, makeGetLoadingState } from '../../appSelector/order';

import FilterableTable from '../../components/FilterTable';
import LoadingIndicator from '../../components/LoadingIndicator';
import { actions } from '../../appReducer/order.reducer';
import './Order.css';

// this should be moved to new file later
const MOMENT_FORMAT = {
  MMM_DD_YYYY: 'MMM DD, YYYY',
};


const renderFunctions = () => <span>⋮</span>;
const renderName = ({ record }) => <Link to={`orders/${record.id}/detail`}>{record.name}</Link>;
const renderDrone = ({ record }) => <Link to={`orders/${record.dronePlanId}/design`}>Drone Partner 1</Link>;
const renderDeadline = (props) => {
  const rawDeadline = props.record.deadline;
  const deadline = rawDeadline ? moment(rawDeadline).format(MOMENT_FORMAT.MMM_DD_YYYY).toString() : '';
  return (
    <div>{ deadline }</div>
  );
};

renderDeadline.propTypes = {
  record: PropTypes.obj,
};

renderName.propTypes = {
  record: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }),
};
renderDrone.propTypes = {
  record: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }),
};

const fields = [
  { name: 'name', displayName: 'Site Name', sortable: true, render: renderName },
  { name: 'status', displayName: 'Status', sortable: true },
  { name: 'deadline', displayName: 'Deadline', sortable: true, thClassName: 'th-deadline', render: renderDeadline },
  { name: 'dronePlanId', displayName: 'Drone Partner', sortable: true, render: renderDrone },
  { name: 'type', displayName: 'Site Type', sortable: true },
  { thClassName: 'empty' },
  { name: '', displayName: '', inputFilterabe: false, sortable: false, render: renderFunctions },
];

class OrderListContainer extends React.Component {
  componentWillMount() {
    this.props.getOrdersRequest();
  }

  render() {
    const { orders = [], isLoading } = this.props;
    const data = orders;

    return isLoading ? (<LoadingIndicator />) : (
      <div>
        <FilterableTable
          namespace="order"
          initialSort="name"
          data={data}
          fields={fields}
          noRecordMessage="There are no data to display"
          noFilterRecordMessage="No data match your filter!"
          topPagerVisible={false}
          headerVisible={false}
        />
      </div>
    );
  }
}

OrderListContainer.propTypes = {
  getOrdersRequest: PropTypes.func,
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

export default compose(withConnect)(OrderListContainer);
