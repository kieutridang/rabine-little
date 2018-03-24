// vendor
import React from 'react';

// app
import ContentWrapper from '../../components/Content/ContentWrapper';
import ContentHeader from '../../components/Content/ContentHeader';
import ContentFilter from '../../components/Content/ContentFilter';
import ContentData from '../../components/Content/ContentData';
import HeaderTitle from '../../components/Title/HeaderTitle';
import Box from '../../components/Box';
import FilterTitle from '../../components/Title/FilterTitle';

class OrderPage extends React.Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props, context) {
    super(props, context);

    this.state = {
      headerQuery: '',
      filterQuery: '',
    };
  }

  render() {
    return (
      <ContentWrapper>
        { /* Header */ }
        <ContentHeader>
          <HeaderTitle
            title="ORDERS"
            subtitle="54 orders"
          />

          <Box
            direction="row"
            justifyContent="between"
          >
          </Box>
        </ContentHeader>

        { /* Filter */ }
        <ContentFilter>
          <FilterTitle text="FILTERS" />
        </ContentFilter>

        { /* Data */ }
        <ContentData>
          Order data
        </ContentData>
      </ContentWrapper>
    );
  }
}

export default OrderPage;
