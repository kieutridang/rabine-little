// vendor
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

// app
import injectSaga from '../../common/injectSaga';
import injectReducer from '../../common/injectReducer';
import { selectDronePartnerListWithFilter, selectIsLoading } from './selectors';
import { fetchDronePartners, searchItem } from './actions';
import saga from './saga';
import reducer from './reducer';

// component
import LoadingIndicator from '../../components/LoadingIndicator';
import ContentWrapper from '../../components/Content/ContentWrapper';
import ContentFilter from '../../components/Content/ContentFilter';
import ContentData from '../../components/Content/ContentData';
import SlidingPane from '../../components/SlidePane';

// will change or move to common components
import IconButton from './components/IconButton';
import AddDronePartnerPane from './components/AddDronePatnerPane';

// resources
import FilterableTable from '../../components/FilterTable';
import FilterIcon from '../../images/icons/filter.svg';
import DronePartnerHeader from './DronePartnerHeader';

const renderFunctions = () => (<span>⋮</span>);

const fields = [
  { name: 'name', displayName: 'Partner Name', sortable: true },
  { name: 'activeJobs', displayName: 'Active Jobs', sortable: true },
  { name: 'completedJobs', displayName: 'Completed Jobs', sortable: true },
  { name: 'averageTurnAround', displayName: 'Average Turnaround', sortable: true },
  { name: '', displayName: ' ', inputFilterable: false, sortable: false, render: renderFunctions },
];


class DronePartnerPage extends Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props, context) {
    super(props, context);

    this.state = {
      isShowFilters: false,
      isAddNewPartnerOpen: false,
    };
  }

  componentWillMount() {
    this.props.fetchDronePartners();
  }

  componentDidMount() {
    Modal.setAppElement('#app');
  }

  onRequestClose = () => {
    this.setState({ isAddNewPartnerOpen: false });
  }

  onOpenAddPartner = () => this.setState({ isAddNewPartnerOpen: true });

  handleShowHideFilters = () => this.setState((prevState) => ({ isShowFilters: !prevState.isShowFilters }));

  render() {
    // const { isAddNewPartnerOpen, dataInPage, loading } = this.state;
    const {
      isLoading,
      dronePartnerList = [],
    } = this.props;

    const {
      isShowFilters,
    } = this.state;

    return (
      <ContentWrapper>
        { /* Header */ }
        <DronePartnerHeader
          isShowFilters={isShowFilters}
          showHideFilters={this.handleShowHideFilters}
          openAddNewDronePartnerPane={this.onOpenAddPartner}
        />

        { /* Filter */ }
        <ContentFilter alignItems={'center'} height={isShowFilters ? '4.5rem' : '0'}>
          <IconButton icon={<FilterIcon />}>FILTERS</IconButton>
        </ContentFilter>

        { /* Data */ }
        <ContentData>
          {
            isLoading ?
              <LoadingIndicator /> :
              <FilterableTable
                namespace="dronePartner"
                initialSort="name"
                data={dronePartnerList}
                fields={fields}
                noRecordsMessage="There are no data to display"
                noFilteredRecordsMessage="No data match your filter!"
                topPagerVisible={false}
                headerVisible={false}
              />
          }
        </ContentData>

        <SlidingPane
          isOpen={this.state.isAddNewPartnerOpen}
          title="Add Drone Partner"
        >
          <AddDronePartnerPane onRequestClose={this.onRequestClose} isOpen={this.state.isAddNewPartnerOpen} />
        </SlidingPane>
      </ContentWrapper>
    );
  }
}

DronePartnerPage.propTypes = {
  isLoading: PropTypes.bool,
  dronePartnerList: PropTypes.arrayOf(PropTypes.object),
  fetchDronePartners: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  isLoading: selectIsLoading(),
  dronePartnerList: selectDronePartnerListWithFilter(),
});

const mapDispatchToProps = (dispatch) => ({
  fetchDronePartners: () => dispatch(fetchDronePartners()),
  searchDroneItem: (searchText) => dispatch(searchItem(searchText)),
});

const withRedux = connect(mapStateToProps, mapDispatchToProps);
const withReducer = injectReducer({ key: 'dronePartner', reducer });
const withSaga = injectSaga({ key: 'dronePartner', saga });

export default compose(
  withReducer,
  withSaga,
  withRedux
)(DronePartnerPage);
