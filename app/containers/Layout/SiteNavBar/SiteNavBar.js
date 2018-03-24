// vendor
import React from 'react';
import PropTypes from 'prop-types';

// app
import SiteNavItem from './SiteNavItem';
import SiteNavTitle from './SiteNavTitle';
import Box from '../../../components/Box';
import ContentHeader from '../../../components/Content/ContentHeader';

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
    key: 'sitePhotos',
    label: 'PHOTOS',
    path: 'photos',
  },
];

class SiteNavBar extends React.Component {
  onNavItemChangedHandler = (selectedPath) => () => this.setState({ selectedPath });

  onGoBack = () => this.props.onGoBack();

  render() {
    const {
      route,
    } = this.props;

    const siteId = route.match.params.siteId || '';

    return (
      <ContentHeader
        height="54px"
        horizontalPadding="100px"
      >
        <SiteNavTitle
          title="105 IOWA AVE. IOWA CITY, IOWA 52245"
          onGoBack={this.onGoBack}
        />

        <Box
          direction="row"
        >
          {
            siteLinks.map((link) => {
              const renderedPath = `/${ROOT_LINK}/${siteId}/${link.path}`;
              const selected = location.pathname === renderedPath;

              return (
                <SiteNavItem
                  key={link.key}
                  label={link.label}
                  selected={selected}
                  path={renderedPath}
                />
              );
            })
          }
        </Box>
      </ContentHeader>
    );
  }
}

SiteNavBar.propTypes = {
  route: PropTypes.any,
  onGoBack: PropTypes.func,
};

export default SiteNavBar;
