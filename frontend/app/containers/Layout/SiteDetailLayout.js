// vendor
import React from 'react';
import PropTypes from 'prop-types';
// app
import LayoutContainer from './LayoutContainer';
import SiteNavBar from './SiteNavBar/SiteNavBar';

const goBack = {
  withPath: (route, path) => route.history && route.history.push(path),
  default: (route) => route.history && route.history.goBack(),
};

const DEFAULT_PATH = ['design', 'map', 'media'];

class SiteDetailLayout extends React.Component {
  state = {
    navTitle: '',
  };

  handleGoBack = () => {
    const { route, root } = this.props;

    if (route && route.match) {
      const path = route.match.path;
      const arrPath = path.split('/');
      const shortenPath = arrPath[arrPath.length - 1];
      const selector = DEFAULT_PATH.indexOf(shortenPath) === -1 ? 'default' : 'withPath';
      goBack[selector](route, root);
    }
  };

  handleChildrenData = (data) => data.navTitle && this.setState({ navTitle: data.navTitle });

  render() {
    const { component: Component, route } = this.props;
    const { navTitle } = this.state;
    return (
      <LayoutContainer direction="column">
        <SiteNavBar route={route} goBack={this.handleGoBack} navTitle={navTitle} />
        <Component route={route} parentCallback={this.handleChildrenData} />
      </LayoutContainer>
    );
  }
}

SiteDetailLayout.propTypes = {
  component: PropTypes.any,
  route: PropTypes.object,
  root: PropTypes.string,
};

export default SiteDetailLayout;
