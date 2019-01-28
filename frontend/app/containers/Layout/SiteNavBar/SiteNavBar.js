// vendor
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

// app
import SiteNavItem from './SiteNavItem';
import SiteNavTitle from './SiteNavTitle';
import Box from '../../../components/Box';
import ContentHeader from '../../../components/Content/ContentHeader';

import * as select from '../../SiteDetail/selector';
import { makeSelectIsSideBarMapOpen } from '../../../appSelector/UI';

const ROOT_LINK = 'sites';

export const siteLinks = [
  {
    key: 'siteDesign',
    label: 'DESIGN',
    path: 'design',
  },
  {
    key: 'siteMap',
    label: 'MAP',
    path: 'map',
  },
  {
    key: 'site3D',
    label: '3D',
    path: '3D',
  },
  {
    key: 'siteMedia',
    label: 'MEDIA',
    path: 'media',
  },
  {
    key: 'siteRepairs',
    label: 'REPAIRS',
    path: 'repairs',
  },
  {
    key: 'siteBidSheet',
    label: 'BID SHEET',
    path: 'bid_sheet',
  },
];

const NavLink = (props) => {
  const renderedPath = `/${ROOT_LINK}/${props.siteId}/${props.link.path}`;
  const selected = location.pathname === renderedPath;
  return <SiteNavItem label={props.link.label} color={props.color} selected={selected} path={renderedPath} />;
};

class SiteNavBar extends React.Component {
  onNavItemChangedHandler = (selectedPath) => () => this.setState({ selectedPath });
  onGoBack = () => {
    const { route } = this.props;
    const nextPath = `/${ROOT_LINK}/${route.match.params.siteId}/design`;
    if (nextPath === route.location.pathname) {
      return this.props.goBack();
    }
    return this.props.route.history.push(`/${ROOT_LINK}/${this.props.route.match.params.siteId}/design`);
  }
  render() {
    const { route, detailData, navTitle, isMapSideBarOpen } = this.props;
    const siteId = route.match.params.siteId || '';
    const title = detailData ? detailData.address : null;

    const isSiteMap = route.match.path.includes('/map');
    const is3DMap = route.match.path.includes('/3D');
    let paddingSiteMap = '6.25rem';
    if (isMapSideBarOpen) paddingSiteMap = 'calc(1.5rem + 250px)';
    const padding = {
      left: isSiteMap ? paddingSiteMap : '6.25rem',
      right: '6.25rem',
    };

    const backgroundColor = (isSiteMap || is3DMap) ? 'hsla(0, 0%, 13%, 1.0)' : '';
    const color = (isSiteMap || is3DMap) ? '#fff' : '';

    return (
      <ContentHeader height="3.375rem" padding={padding} backgroundColor={backgroundColor} border={false} >
        <SiteNavTitle title={title || navTitle} onGoBack={this.onGoBack} color={color} />
        <Box direction="row">
          {siteLinks.map((link) => <NavLink link={link} siteId={siteId} key={link.key} color={color} />)}
        </Box>
      </ContentHeader>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  detailData: select.DetailData(),
  isMapSideBarOpen: makeSelectIsSideBarMapOpen(),
});

const withRedux = connect(mapStateToProps, null);

SiteNavBar.propTypes = {
  route: PropTypes.any,
  goBack: PropTypes.func,
  detailData: PropTypes.object,
  navTitle: PropTypes.string,
  isMapSideBarOpen: PropTypes.bool,
};

NavLink.propTypes = {
  siteId: PropTypes.string,
  color: PropTypes.string,
  link: PropTypes.shape({
    key: PropTypes.string,
    path: PropTypes.string,
    label: PropTypes.string,
  }),
};

export default compose(withRedux)(SiteNavBar);
