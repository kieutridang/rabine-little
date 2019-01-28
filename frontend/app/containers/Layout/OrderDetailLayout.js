// vendor
import React from 'react';
import PropTypes from 'prop-types';

// app
import LayoutContainer from './LayoutContainer';
import OrderNavbar from './OrderNavBar';

class OrderDetailLayout extends React.Component {
  state = {
    navTitle: '',
  };

  handleGoBack = () => {
    if (this.props.route && this.props.route.history && this.props.root) {
      this.props.route.history.push(this.props.root);
    }
  };

  handleChildrenData = ({ navTitle = '' }) => {
    this.setState({ navTitle });
  };

  render() {
    const { component: Component, route } = this.props;
    return (
      <LayoutContainer direction="column">
        <OrderNavbar title={this.state.navTitle} route={route} goBack={this.handleGoBack} />
        <Component route={route} parentCallback={this.handleChildrenData} />
      </LayoutContainer>
    );
  }
}

OrderDetailLayout.propTypes = {
  component: PropTypes.any,
  route: PropTypes.object,
  root: PropTypes.string,
};

export default OrderDetailLayout;
