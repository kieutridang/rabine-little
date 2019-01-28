// vendor
import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

// app
import ContentFilter from '../../components/Content/ContentFilter';
import FilterTitle from '../../components/Title/FilterTitle';
import RabineDateRangePicker from '../../components/Date/DateRangePicker';

import { typeOptions, statusOptions } from '../Common/Options';
import { actions as filterActions } from '../../appReducer/filter.reducer';
import { actions as clientActions } from '../../appReducer/client.reducer';
import { makeGetClients } from '../../appSelector/client';
import {
  makeSelectTypeFilter,
  makeSelectStatusFilter,
  makeSelectClientIdFilter,
  makeSelectStartDateFilter,
  makeSelectEndDateFilter,
} from '../../appSelector/filter';
import ExtendedSelect from '../../components/Select';

class SiteFilters extends React.Component {
  state = {
    calendarFocused: null,
  }

  componentDidMount() {
    this.props.getClients();
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

  onStatusChange = (e) => {
    this.props.onStatusChange(e ? e.value : null);
  };

  render() {
    const {
      clients,
      status,
      type,
      clientId,
      startDate,
      endDate,
      height,
    } = this.props;

    const clientOptions = (clients || []).map((i) => ({
      label: i.name,
      value: i.id,
    }));

    const typeOpts = (typeOptions || []).map((i) => ({
      label: i.text,
      value: i.value,
    }));

    const statusOpts = (statusOptions || []).map((i) => ({
      label: i.text,
      value: i.value,
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

        <ExtendedSelect
          id="type"
          name="type"
          placeholder="Site Type"
          value={type}
          options={typeOpts}
          onChange={this.onSiteTypeChange}
        />

        <ExtendedSelect
          id="status"
          name="status"
          placeholder="Status"
          value={status}
          options={statusOpts}
          onChange={this.onStatusChange}
        />
      </ContentFilter>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  getClients: (filter) => dispatch(clientActions.getClientsRequest(filter)),
  onSiteTypeChange: (value) => dispatch(filterActions.setSiteTypeFilter(value)),
  onStatusChange: (value) => dispatch(filterActions.setSiteStatusFilter(value)),
  onClientChange: (value) => dispatch(filterActions.setSiteClientFilter(value)),
  setStartDate: (value) => dispatch(filterActions.setStartDateFilter(value)),
  setEndDate: (value) => dispatch(filterActions.setEndDateFilter(value)),
});

const mapStateToProps = createStructuredSelector({
  startDate: makeSelectStartDateFilter(),
  endDate: makeSelectEndDateFilter(),
  clientId: makeSelectClientIdFilter(),
  type: makeSelectTypeFilter(),
  status: makeSelectStatusFilter(),
  clients: makeGetClients(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

SiteFilters.propTypes = {
  clients: PropTypes.array,
  getClients: PropTypes.func,
  onSiteTypeChange: PropTypes.func,
  onStatusChange: PropTypes.func,
  setStartDate: PropTypes.func,
  setEndDate: PropTypes.func,
  onClientChange: PropTypes.func,
  clientId: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.string]),
  type: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.string]),
  status: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.string]),
  startDate: PropTypes.object,
  endDate: PropTypes.object,
  height: PropTypes.string,
};

export default compose(
  withConnect,
)(SiteFilters);
