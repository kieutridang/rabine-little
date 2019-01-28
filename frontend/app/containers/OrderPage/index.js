// vendor
import React from 'react';

// app
import ContentWrapper from '../../components/Content/ContentWrapper';
import ContentData from '../../components/Content/ContentData';

import OrderList from './OrderList/orderList.agGrid.container';
import OrderHeader from './OrderHeader';
import OrderFilters from './OrderFilters';

class OrderPage extends React.Component {
  // eslint-disable-line react/prefer-stateless-function

  constructor(props, context) {
    super(props, context);

    this.state = {
      isShowFilters: false,
    };
  }

  handleShowHideFilters = () => this.setState((prevState) => ({ isShowFilters: !prevState.isShowFilters }));

  render() {
    const {
      isShowFilters,
    } = this.state;

    return (
      <ContentWrapper>
        {/* Header */}
        <OrderHeader
          showHideFilters={this.handleShowHideFilters}
          isShowFilters={isShowFilters}
        />

        {/* Filter */}
        <OrderFilters height={isShowFilters ? '4.5rem' : '0'} />

        {/* Data */}
        <ContentData margin={{ vertical: '2rem' }}>
          <OrderList />
        </ContentData>
      </ContentWrapper>
    );
  }
}

export default OrderPage;
