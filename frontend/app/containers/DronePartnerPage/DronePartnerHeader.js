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
import { makeSelectDronePartnerNameFilter } from '../../appSelector/filter';

class DronePartnerHeader extends React.Component {
  componentWillUnmount() {
    this.props.resetNameFilter();
  }

  render() {
    const {
      openAddNewDronePartnerPane,
      showHideFilters,
      handleNameChange,
      isShowFilters,
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
          title="DRONE PARTNERS"
          subtitle="35 Drone Partners"
        />

        <ContentForm>
          <Input
            id="name"
            name="name"
            width="13.75rem"
            height="2.5rem"
            placeholder="Search Partners"
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
            color="primary"
            label="ADD PARTNER"
            width="8.4375rem"
            height="2.5rem"
            onClick={openAddNewDronePartnerPane}
          />
        </ContentForm>
      </ContentHeader>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  name: makeSelectDronePartnerNameFilter(),
});

const mapDispatchToProps = (dispatch) => ({
  handleNameChange: (value) => dispatch(actions.setDronePartnerNameFilter(value)),
  resetNameFilter: () => dispatch(actions.setDronePartnerNameFilter('')),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

DronePartnerHeader.propTypes = {
  openAddNewDronePartnerPane: PropTypes.func,
  showHideFilters: PropTypes.func,
  handleNameChange: PropTypes.func,
  resetNameFilter: PropTypes.func,
  isShowFilters: PropTypes.bool,
  name: PropTypes.string,
};

export default compose(
  withConnect,
)(DronePartnerHeader);
