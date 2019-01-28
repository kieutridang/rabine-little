// vendor
import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

// app
import Input from '../../components/Input';
import Button from '../../components/Button';
import SearchIcon from '../../images/search.png';
import HeaderTitle from '../../components/Title/HeaderTitle';
import ContentHeader from '../../components/Content/ContentHeader';
import ContentForm from '../../components/Content/ContentForm';
import { actions } from '../../appReducer/filter.reducer';
import { makeSelectSiteNameFilter } from '../../appSelector/filter';

class SiteHeader extends React.Component {
  componentWillUnmount() {
    this.props.resetNameFilter();
  }

  render() {
    const {
      openBulkUploadPane,
      openAddNewSitePane,
      handleNameChange,
      isShowFilters,
      showHideFilters,
      name,
    } = this.props;

    const onChange = (event) => {
      const value = event.target.value;
      if (handleNameChange) {
        handleNameChange(value);
      }
    };

    return (
      <ContentHeader>
        <HeaderTitle
          title="SITES"
          subtitle="45 sites"
        />

        <ContentForm>
          <Input
            id="name"
            name="name"
            width="13.75rem"
            height="2.5rem"
            placeholder="Search Sites"
            icon={SearchIcon}
            onChange={onChange}
            value={name}
            margin={{
              right: '13px',
            }}
          />

          <Button
            color="primary"
            label={isShowFilters ? 'HIDE FILTERS' : 'FILTERS'}
            width="8.4375rem"
            height="2.5rem"
            noBackground
            icon={!isShowFilters ? 'filter' : ''}
            onClick={showHideFilters}
          />
          <Button
            color="secondary"
            label="IMPORT SITES"
            width="8.4375rem"
            height="2.5rem"
            onClick={openBulkUploadPane}
          />
          <Button
            color="primary"
            label="ADD SITE"
            width="8.4375rem"
            height="2.5rem"
            onClick={openAddNewSitePane}
          />
        </ContentForm>
      </ContentHeader>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  name: makeSelectSiteNameFilter(),
});

const mapDispatchToProps = (dispatch) => ({
  handleNameChange: (value) => dispatch(actions.setSiteNameFilter(value)),
  resetNameFilter: () => dispatch(actions.setSiteNameFilter('')),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

SiteHeader.propTypes = {
  openBulkUploadPane: PropTypes.func,
  openAddNewSitePane: PropTypes.func,
  handleNameChange: PropTypes.func,
  resetNameFilter: PropTypes.func,
  isShowFilters: PropTypes.bool,
  showHideFilters: PropTypes.func,
  name: PropTypes.string,
};

export default compose(
  withConnect,
)(SiteHeader);
