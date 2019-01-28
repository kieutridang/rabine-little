// vendor
import React from 'react';
import PropTypes from 'prop-types';

// app
import ContentFilter from '../../components/Content/ContentFilter';
import FilterTitle from '../../components/Title/FilterTitle';

const ClientFilters = ({ isShowFilters = false }) => (
  <ContentFilter height={isShowFilters ? '4.5rem' : '0'}>
    <FilterTitle text="FILTERS" />
  </ContentFilter>
);

ClientFilters.propTypes = {
  isShowFilters: PropTypes.bool,
};

export default ClientFilters;
