// vendor
import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

// app
import FilterTitle from '../../components/Title/FilterTitle';
import ContentFilter from '../../components/Content/ContentFilter';
import RabineDateRangePicker from '../../components/Date/DateRangePicker';
import ExtendedSelect from '../../components/Select';

import { actions as clientActions } from '../../appReducer/client.reducer';
import { actions as filterActions } from '../../appReducer/filter.reducer';
import {
  makeSelectClientIdFilter,
  makeSelectStartDateFilter,
  makeSelectEndDateFilter,
} from '../../appSelector/filter';
import { makeGetClients } from '../../appSelector/client';

class OrderFilters extends React.Component {
  state = {
    calendarFocused: null,
  }

  componentDidMount() {
    this.props.getClients();
    this.props.resetSiteClient();
    this.props.resetStartDate();
    this.props.resetEndDate();
  }

  onDatesChange = ({ startDate, endDate }) => {
    this.props.setStartDate(startDate);
    this.props.setEndDate(endDate);
  };

  onFocusChange = (calendarFocused) => {
    this.setState(() => ({ calendarFocused }));
  };

  onClientChange = (e) => {
    this.props.onClientChange(e ? e.value : null);
  };

  onSiteTypeChange = (e) => {
    this.props.onSiteTypeChange(e ? e.value : null);
  };

  render() {
    const {
      clients,
      clientId,
      startDate,
      endDate,
      height,
    } = this.props;

    const clientOptions = (clients || []).map((i) => ({
      label: i.name,
      value: i.id,
    }));

    return (
      <ContentFilter
        justifyContent="start"
        alignItems="center"
        height={height}
      >
        <FilterTitle text="FILTERS" />

        <RabineDateRangePicker
          startDateId="startDate"
          endDateId="endDate"
          startDate={startDate}
          endDate={endDate}
          onDatesChange={this.onDatesChange}
          focusedInput={this.state.calendarFocused}
          onFocusChange={this.onFocusChange}
        />

        <ExtendedSelect
          id="clientId"
          name="clientId"
          placeholder="Client"
          value={clientId}
          options={clientOptions}
          onChange={this.onClientChange}
        />
      </ContentFilter>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  getClients: (filter) => dispatch(clientActions.getClientsRequest(filter)),
  onClientChange: (value) => dispatch(filterActions.setSiteClientFilter(value)),
  setStartDate: (value) => dispatch(filterActions.setStartDateFilter(value)),
  setEndDate: (value) => dispatch(filterActions.setEndDateFilter(value)),

  resetSiteClient: () => dispatch(filterActions.setSiteClientFilter(null)),
  resetDronePlan: () => dispatch(filterActions.setDronePartnerIdFilter(null)),
  resetStartDate: () => dispatch(filterActions.setStartDateFilter(null)),
  resetEndDate: () => dispatch(filterActions.setEndDateFilter(null)),
});

const mapStateToProps = createStructuredSelector({
  clientId: makeSelectClientIdFilter(),
  startDate: makeSelectStartDateFilter(),
  endDate: makeSelectEndDateFilter(),
  clients: makeGetClients(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

OrderFilters.propTypes = {
  clients: PropTypes.array,
  getClients: PropTypes.func,
  onSiteTypeChange: PropTypes.func,
  setStartDate: PropTypes.func,
  setEndDate: PropTypes.func,
  onClientChange: PropTypes.func,
  resetSiteClient: PropTypes.func,
  resetStartDate: PropTypes.func,
  resetEndDate: PropTypes.func,
  clientId: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.string]),
  startDate: PropTypes.object,
  endDate: PropTypes.object,
  height: PropTypes.string,
};

export default compose(
  withConnect,
)(OrderFilters);
