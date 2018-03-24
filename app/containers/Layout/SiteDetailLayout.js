// vendor
import React from 'react';
import PropTypes from 'prop-types';

// app
import LayoutContainer from './LayoutContainer';
import SiteNavBar from './SiteNavBar/SiteNavBar';

class SiteDetailLayout extends React.Component {
  handleGoBack = () => {
    if (this.props.route && this.props.route.history && this.props.root) {
      this.props.route.history.push(this.props.root);
    }
  }

  render() {
    const {
      component: Component,
      route,
    } = this.props;

    return (
      <LayoutContainer direction="column">
        <SiteNavBar route={route} onGoBack={this.handleGoBack} />
        <Component route={route} />
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
