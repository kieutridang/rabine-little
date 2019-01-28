// vendor
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

// app
import SiteNavItem from '../SiteNavBar/SiteNavItem';
import SiteNavTitle from '../SiteNavBar/SiteNavTitle';
import Box from '../../../components/Box';
import ContentHeader from '../../../components/Content/ContentHeader';

import * as select from '../../OrderDetail/orderDetail.selector';

const ROOT_LINK_SITES = 'sites';
const ROOT_LINK_ORDERS = 'orders';

export const orderLinks = [
  {
    key: 'orderDesign',
    label: 'DETAIL',
    path: 'detail',
  },
];

const NavLink = (props) => {
  const renderedPath = `/${ROOT_LINK_SITES}/${props.siteId}/${ROOT_LINK_ORDERS}/${props.orderId}/${props.link.path}`;
  const selected = location.pathname === renderedPath;

  return <SiteNavItem label={props.link.label} selected={selected} path={renderedPath} />;
};

class OrderNavbar extends React.Component {

  onNavItemChangedHandler = (selectedPath) => () => this.setState({ selectedPath });

  onGoBack = () => this.props.goBack();

  render() {
    const { route, detailData, navTitle } = this.props;
    const orderId = route.match.params.orderId || '';
    const title = detailData ? detailData.name : null;

    return (
      <ContentHeader height="3.375rem" horizontalPadding="6.25rem">
        <SiteNavTitle title={title || navTitle} onGoBack={this.onGoBack} />
        <Box direction="row">
          {orderLinks.map((link) => <NavLink link={link} orderId={orderId} key={link.key} />)}
        </Box>
      </ContentHeader>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  detailData: select.makeSelectOrder(),
});

const withRedux = connect(mapStateToProps, null);

OrderNavbar.propTypes = {
  route: PropTypes.any,
  goBack: PropTypes.func,
  detailData: PropTypes.object,
  navTitle: PropTypes.string,
};

NavLink.propTypes = {
  siteId: PropTypes.string,
  orderId: PropTypes.string,
  link: PropTypes.shape({
    key: PropTypes.string,
    path: PropTypes.string,
    label: PropTypes.string,
  }),
};

export default compose(withRedux)(OrderNavbar);
