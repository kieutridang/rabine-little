// vendor
import React from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { actions } from '../../appReducer/site.reducer';

// app
import ContentWrapper from '../../components/Content/ContentWrapper';
import ContentHeader from '../../components/Content/ContentHeader';
import ContentFilter from '../../components/Content/ContentFilter';
import ContentData from '../../components/Content/ContentData';
import FilterTitle from '../../components/Title/FilterTitle';
import HeaderTitle from '../../components/Title/HeaderTitle';
import Box from '../../components/Box';
import Button from '../../components/Button';
import SlidingPane from '../../components/SlidePane';

import SiteAdd from './siteAdd.container';
import SiteList from './siteList.container';


class SitePage extends React.Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props, context) {
    super(props, context);

    this.state = {
      headerQuery: '',
      filterQuery: '',
      isBulkUploadOpen: false,
    };
  }

  componentDidMount() {
    Modal.setAppElement('#app');
  }

  onNewSiteHandler = () => this.props.showAddSite();

  render() {
    const { isBulkUploadOpen } = this.state;

    return (
      <ContentWrapper>
        { /* Header */ }
        <ContentHeader>
          <HeaderTitle
            title="SITES"
            subtitle="45 sites"
          />

          <Box
            direction="row"
            justifyContent="between"
          >
            <Button
              color="secondary"
              label="BULK ADD SITES"
              onClick={() => this.setState({ isBulkUploadOpen: true })}
            />
            <Button
              color="primary"
              label="ADD NEW SITE"
              onClick={this.onNewSiteHandler}
            />
          </Box>
        </ContentHeader>

        { /* Filter */ }
        <ContentFilter>
          <FilterTitle text="FILTERS" />
        </ContentFilter>

        { /* Data */ }
        <ContentData>
          <SiteList />
        </ContentData>

        <SiteAdd />


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

SitePage.propTypes = {
  showAddSite: PropTypes.func,
};

const mapDispatchToProps = (dispatch) => ({
  showAddSite: () => dispatch(actions.showAddSite()),
});

export default connect(null, mapDispatchToProps)(SitePage);

