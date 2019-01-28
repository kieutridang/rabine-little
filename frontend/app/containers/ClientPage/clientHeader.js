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
import { makeSelectClientNameFilter } from '../../appSelector/filter';

class ClientHeader extends React.Component {
  componentWillUnmount() {
    this.props.resetClientNameFilter();
  }

  render() {
    const {
      openAddNewClientPane,
      handleClientNameChange,
      showHideFilters,
      isShowFilters,
      clientName,
    } = this.props;

    const onChange = (event) => {
      const value = event.target.value;
      if (handleClientNameChange) {
        handleClientNameChange(value);
      }
    };

    return (
      <ContentHeader>
        <HeaderTitle
          title="CLIENTS"
          subtitle="6 clients"
        />

        <ContentForm>
          <Input
            id="name"
            name="name"
            width="13.75rem"
            height="2.5rem"
            placeholder="Search Clients"
            icon={SearchIcon}
            onChange={onChange}
            value={clientName}
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
            width="8.4375rem"
            height="2.5rem"
            color="primary"
            label="ADD CLIENT"
            onClick={openAddNewClientPane}
          />
        </ContentForm>
      </ContentHeader>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  clientName: makeSelectClientNameFilter(),
});

const mapDispatchToProps = (dispatch) => ({
  handleClientNameChange: (value) => dispatch(actions.setClientNameFilter(value)),
  resetClientNameFilter: () => dispatch(actions.setClientNameFilter('')),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

ClientHeader.propTypes = {
  openAddNewClientPane: PropTypes.func,
  handleClientNameChange: PropTypes.func,
  resetClientNameFilter: PropTypes.func,
  showHideFilters: PropTypes.func,
  isShowFilters: PropTypes.bool,
  clientName: PropTypes.string,
};

export default compose(
  withConnect,
)(ClientHeader);
