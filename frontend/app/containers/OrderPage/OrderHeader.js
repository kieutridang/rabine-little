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

class OrderHeader extends React.Component {
  componentWillUnmount() {
    this.props.resetNameFilter();
  }

  render() {
    const {
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
          title="ORDERS"
          subtitle="54 open orders"
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

OrderHeader.propTypes = {
  showHideFilters: PropTypes.func,
  handleNameChange: PropTypes.func,
  resetNameFilter: PropTypes.func,
  isShowFilters: PropTypes.bool,
  name: PropTypes.string,
};

export default compose(
  withConnect,
)(OrderHeader);
