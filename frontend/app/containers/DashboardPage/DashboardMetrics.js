// vendor
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

// app
import Box from '../../components/Box';
import Metric from '../../components/Metric';
import { dollarFormatter } from '../../utils/number/numberUtils';
import { actions } from '../../appReducer/siteMetrics.reducer';
import { makeSelectSiteMetrics, makeSelectIsLoading } from '../../appSelector/siteMetrics';
import LoadingIndicator from '../../components/LoadingIndicator';

class DashboardMetrics extends React.Component {
  componentWillMount() {
    this.props.getSiteMetricsRequest();
  }

  renderMetrics = () => {
    const { metrics } = this.props;
    const { totalOrders, openOrders, totalRevenue, orderCompleted } = metrics;
    return (
      <DashboardMetricsContainer>
        <Metric
          number={totalOrders.toString()}
          text="Total Orders"
        />

        <Metric
          number={openOrders.toString()}
          text="Open Orders"
        />

        <Metric
          number={`$${dollarFormatter(totalRevenue, 0)}`}
          text="Total Revenue"
        />

        <Metric
          number={orderCompleted.toString()}
          text="Order Completed"
        />
      </DashboardMetricsContainer>
    );
  }

  render() {
    const { metrics, isLoading } = this.props;
    return isLoading || !metrics
      ? <LoadingIndicator />
      : this.renderMetrics();
  }
}

DashboardMetrics.propTypes = {
  metrics: PropTypes.object,
  isLoading: PropTypes.bool,
  getSiteMetricsRequest: PropTypes.func,
};

const DashboardMetricsContainer = ({ children }) => (
  <Box
    direction="row"
    fill="horizontal"
    height="9.375rem"
    justifyContent="between"
    alignItems="center"
  >
    {children}
  </Box>
);

DashboardMetricsContainer.propTypes = {
  children: PropTypes.node,
};

const mapStateToProps = createStructuredSelector({
  isLoading: makeSelectIsLoading(),
  metrics: makeSelectSiteMetrics(),
});

const mapDispatchToProps = (dispatch) => ({
  getSiteMetricsRequest: () => dispatch(actions.getSiteMetricsRequest()),
});

export default connect(mapStateToProps, mapDispatchToProps)(DashboardMetrics);
