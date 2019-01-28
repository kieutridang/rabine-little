// vendor
import React from 'react';

// app
import ClientList from './clientList.agGrid.container';
import ContentData from '../../components/Content/ContentData';

const ClientContent = () => (
  <ContentData margin={{ vertical: '2rem' }}>
    <ClientList />
  </ContentData>
);

export default ClientContent;
