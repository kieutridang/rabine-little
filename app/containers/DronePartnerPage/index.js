// vendor
import React, { Component, PropTypes } from 'react';
import Modal from 'react-modal';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

// app
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { selectDronePartnerList, selectIsLoading } from './selectors';
import { fetchDronePartners, searchItem } from './actions';
import saga from './saga';
import reducer from './reducer';

// component
import LoadingIndicator from '../../components/LoadingIndicator';
import ContentWrapper from '../../components/Content/ContentWrapper';
import ContentHeader from '../../components/Content/ContentHeader';
import ContentFilter from '../../components/Content/ContentFilter';
import ContentData from '../../components/Content/ContentData';
import SlidingPane from '../../components/SlidePane';

// will change or move to common components
import TitleWrapper from './components/TitleWrapper';
import HeaderTitle from './components/HeaderTitle';
import HeaderSubTitle from './components/HeaderSubTitle';
import IconButton from './components/IconButton';
import ActionWrapper from './components/ActionWrapper';
import SearchInput from './components/SearchInput';
import Button from '../../components/Button';
import AddDronePartnerPane from './components/AddDronePatnerPane';

// resources
import FilterableTable from '../../components/FilterTable';
import FilterIcon from '../../images/icons/filter.svg';

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
      headerQuery: '',
      filterQuery: '',
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

  render() {
    // const { isAddNewPartnerOpen, dataInPage, loading } = this.state;
    const {
      isLoading,
      dronePartnerList = [],
      searchDroneItem,
    } = this.props;

    return (
      <ContentWrapper>
        { /* Header */ }
        <ContentHeader>
          <TitleWrapper>
            <HeaderTitle>Drone Partners</HeaderTitle>
            <HeaderSubTitle>35 Drone Partners</HeaderSubTitle>
          </TitleWrapper>

          <ActionWrapper>
            <SearchInput placeholder="Search Orders" onEnter={(text) => searchDroneItem(text)} />
            <Button
              color="primary"
              label="ADD NEW PARTNER"
              width="173px"
              onClick={() => this.setState({ isAddNewPartnerOpen: true })}
            />
          </ActionWrapper>
        </ContentHeader>

        { /* Filter */ }
        <ContentFilter alignItems={'center'}>
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
  searchDroneItem: PropTypes.func,
  fetchDronePartners: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  isLoading: selectIsLoading(),
  dronePartnerList: selectDronePartnerList(),
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
