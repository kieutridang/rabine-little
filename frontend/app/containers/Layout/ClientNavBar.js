// vendor
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

// app
import SiteNavItem from './SiteNavBar/SiteNavItem';
import SiteNavTitle from './SiteNavBar/SiteNavTitle';
import Box from '../../components/Box';
import ContentHeader from '../../components/Content/ContentHeader';

import * as select from '../ClientDetail/selector';

const ROOT_LINK = 'clients';

export const clientLinks = [
  {
    key: 'clientDesign',
    label: 'DESIGN',
    path: 'design',
  },
  {
    key: 'clientBidSheet',
    label: 'BID SHEET',
    path: 'bid_sheet',
  },
];

const NavLink = (props) => {
  const renderedPath = `/${ROOT_LINK}/${props.clientId}/${props.link.path}`;
  const selected = location.pathname === renderedPath;

  return <SiteNavItem label={props.link.label} selected={selected} path={renderedPath} />;
};

class ClientNavBar extends React.Component {

  onNavItemChangedHandler = (selectedPath) => () => this.setState({ selectedPath });

  onGoBack = () => this.props.goBack();

  render() {
    const { route, detailData, navTitle } = this.props;
    const clientId = route.match.params.clientId || '';
    const title = detailData ? detailData.address : null;

    return (
      <ContentHeader height="3.375rem" horizontalPadding="6.25rem">
        <SiteNavTitle title={title || navTitle} onGoBack={this.onGoBack} />
        <Box direction="row">
          {clientLinks.map((link) => <NavLink link={link} clientId={clientId} key={link.key} />)}
        </Box>
      </ContentHeader>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  detailData: select.DetailData(),
});

const withRedux = connect(mapStateToProps, null);

ClientNavBar.propTypes = {
  route: PropTypes.any,
  goBack: PropTypes.func,
  detailData: PropTypes.object,
  navTitle: PropTypes.string,
};

NavLink.propTypes = {
  clientId: PropTypes.string,
  link: PropTypes.shape({
    key: PropTypes.string,
    path: PropTypes.string,
    label: PropTypes.string,
  }),
};

export default compose(withRedux)(ClientNavBar);
