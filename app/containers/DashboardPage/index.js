// vendor
import React from 'react';
import Modal from 'react-modal';
import { Link } from 'react-router-dom';

// app
import ContentWrapper from '../../components/Content/ContentWrapper';
import ContentHeader from '../../components/Content/ContentHeader';
import ContentFilter from '../../components/Content/ContentFilter';
import ContentData from '../../components/Content/ContentData';
import Button from '../../components/Button/';
import SlidingPane from '../../components/SlidePane';
import HeaderTitle from '../../components/Title/HeaderTitle';
import FilterTitle from '../../components/Title/FilterTitle';
import ContentForm from '../../components/Content/ContentForm';
import Input from '../../components/Input';
import SearchIcon from '../../images/search.png';
import RabineDateRangePicker from '../../components/Date/DateRangePicker';
import RabineSingleDatePicker from '../../components/Date/SingleDatePicker';
import HorizontalLinearStepper from '../../components/Stepper/HorizontalLinearStepper';

class DashboardPage extends React.Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props, context) {
    super(props, context);

    this.state = {
      headerQuery: '',
      filterQuery: '',
      isAddNewSiteOpen: false,
      isBulkUploadOpen: false,
    };
  }

  componentDidMount() {
    Modal.setAppElement('#app');
  }

  render() {
    const {
      isAddNewSiteOpen,
      isBulkUploadOpen,
    } = this.state;

    return (
      <ContentWrapper tag="article">
        { /* Header */ }
        <ContentHeader>
          <HeaderTitle
            title="DASHBOARD"
            subtitle="85 orders"
          />

          <ContentForm>
            <Input
              id="searchOrders"
              name="searchOrders"
              placeholder="Search Orders"
              icon={SearchIcon}
              margin={{
                right: '13px',
              }}
            />
            <Button
              color="secondary"
              label="BULK ADD SITES"
              onClick={() => this.setState({ isBulkUploadOpen: true })}
            />
            <Button
              color="primary"
              label="ADD NEW SITE"
              onClick={() => this.setState({ isAddNewSiteOpen: true })}
            />
          </ContentForm>
        </ContentHeader>

        { /* Filter */ }
        <ContentFilter
          justifyContent="start"
          alignItems="center"
        >
          <FilterTitle text="FILTERS" />
          <RabineDateRangePicker
            startDateId="startDate"
            endDateId="endDate"
          />
        </ContentFilter>

        { /* Data */ }
        <ContentData>
          <div><Link to="/sites/1" >Go To Site Detail screen</Link></div>

          <div><Link to="/sites/1/map">Go To Site Maps screen</Link></div>

          <HorizontalLinearStepper />
        </ContentData>

        <SlidingPane
          isOpen={isAddNewSiteOpen}
          title="Add Site"
          onRequestClose={() => {
            this.setState({ isAddNewSiteOpen: false });
          }}
        >
          <RabineSingleDatePicker
            block
            showClearDate
            label="123123"
          />
        </SlidingPane>

        <SlidingPane
          isOpen={isBulkUploadOpen}
          title="Bulk Upload"
          onRequestClose={() => {
            this.setState({ isBulkUploadOpen: false });
          }}
        >
          <div>Form goes here</div>
        </SlidingPane>
      </ContentWrapper>
    );
  }
}

export default DashboardPage;
