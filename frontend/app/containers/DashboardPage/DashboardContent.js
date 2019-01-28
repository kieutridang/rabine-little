// vendor
import React from 'react';

// app
import ContentData from '../../components/Content/ContentData';
import DashboardMetrics from './DashboardMetrics';
import SiteList from '../SitePage/SiteList/siteList.agGrid.container';

const DashboardContent = () => (
  <ContentData>
    <DashboardMetrics />
    <SiteList />
  </ContentData>
);

export default DashboardContent;
