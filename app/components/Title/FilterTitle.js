// vendor
import React from 'react';
import PropTypes from 'prop-types';

// app
import Box from '../Box/index';
import FilterIcon from '../../images/icons/filter.svg';
import { StyledImageWrapper, StyledFilterText } from './StyledTitle';

const FilterTitle = ({ text }) => (
  <Box
    direction="row"
    alignItems="center"
  >
    <StyledImageWrapper>
      <FilterIcon />
    </StyledImageWrapper>

    <StyledFilterText>
      { text }
    </StyledFilterText>
  </Box>
);

FilterTitle.propTypes = {
  text: PropTypes.string.isRequired,
};

export default FilterTitle;
