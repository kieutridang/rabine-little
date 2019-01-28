import React from 'react';
import {
  Page,
  Text,
  View,
  Image,
} from '@react-pdf/renderer';

import PropTypes from 'prop-types';

import {
  Info,
  Subtitle,
} from './components/PDFComponents';

import ZoneTable from './components/PDFComponents/ZoneTable';
import RepairsTable from './components/PDFComponents/RepairsTable';

import styles from './pdfStyles';

import SiteLogo from '../../../../images/sitelogoblack.png';

const Document = 'DOCUMENT';

const pagingRendering = ({ pageNumber, totalPages }) => (`${pageNumber} / ${totalPages}`);

const renderLogoSection = (color, logoPermitted, clientLogo) => (
  <View style={[{ backgroundColor: color || '#272727' }, styles.header]} fixed>
    {
      clientLogo && clientLogo.blobUrl && <Image src={clientLogo.blobUrl} fixed style={styles.logoImageLeft} />
    }
    {
      logoPermitted ? <Image src={`${SiteLogo}`} fixed style={styles.logoImage} /> : null
    }
  </View>
);

const renderLeftContainer = (text1, placeHolderText = 'Property Screenshot', defaultStyle = [styles.sideContainer]) => (
  <View style={defaultStyle}>
    <View style={styles.pictureSide}>
      <Subtitle>{text1}</Subtitle>
      <View style={styles.screenshotPlaceholder}>
        <Text style={styles.screenshotPlaceholderText}>{placeHolderText}</Text>
      </View>
    </View>
  </View>
);

const RightContainer = ({
  /* eslint-disable */
  text2,
  clientLogo,
  children,
  containerStyles = [styles.sideContainer, styles.rightContainer],
  /* eslint-enable */
}) => (
  <View style={containerStyles}>
    <View style={styles.detailSide}>
      <Subtitle>{text2}</Subtitle>
      <View style={styles.details}>
        {children}
      </View>
    </View>
  </View>
);

const renderLogo = (color, logoPermitted, text1, text2, clientLogo) => (
  <Page orientation="landscape">
    {renderLogoSection(color, logoPermitted, clientLogo)}
    <View style={styles.body}>
      { renderLeftContainer(text1 || 'Pavement Assessment Report', 'Property Screenshot') }
      <RightContainer text2={text2 || 'Location Overview'} clientLogo={clientLogo} >
        <Info label="Site Address">
          { '[Site Address]' }
        </Info>
        <Info label="Total exterior concrete">
          [Calculation]
        </Info>
        <Info label="Total exterior Asphalt">
          [Calculation]
        </Info>
        <Info label="Location weighted pci">
          [Calculation]
        </Info>
      </RightContainer>
    </View>
    <Text style={styles.pageNumber} render={pagingRendering} fixed />
  </Page>
);


const renderZone = (color, logoPermitted, text3, text4, zoneCheckboxes, clientLogo) => (
  <Page orientation="landscape">
    { renderLogoSection(color, logoPermitted, clientLogo) }
    <View style={styles.body}>
      { renderLeftContainer(text3 || 'Zone Map', 'Zone Map Screenshot') }
      <RightContainer text2={text4 || 'Zone Information'} clientLogo={clientLogo} >
        <ZoneTable checkboxes={zoneCheckboxes} />
      </RightContainer>
    </View>
    <Text style={styles.pageNumber} render={pagingRendering} fixed />
  </Page>
);

const renderRepair = (color, logoPermitted, text5, repairCheckboxes, clientLogo) => (
  <Page orientation="landscape">
    { renderLogoSection(color, logoPermitted, clientLogo) }
    <View style={styles.body}>
      {
        renderLeftContainer(
          text5 || 'Repair Map',
          'Repair Map Screenshot',
          [styles.sideContainer, styles.shortLeftContainer]
        )
      }

      <RightContainer
        text2={'[Year]'}
        clientLogo={clientLogo}
        containerStyles={[styles.sideContainer, styles.rightContainer, styles.longRightContainer]}
      >
        <RepairsTable checkboxes={repairCheckboxes} />
      </RightContainer>
    </View>
    <Text style={styles.pageNumber} render={pagingRendering} fixed />
  </Page>
);

export const doc = (
  { text1, text2, text3, text4, text5 },
  color,
  zoneCheckboxes,
  repairCheckboxes,
  clientLogo,
  logoPermitted
) => (
  <Document title="BidSheet">
    {renderLogo(color, logoPermitted, text1, text2, clientLogo)}
    {renderZone(color, logoPermitted, text3, text4, zoneCheckboxes, clientLogo)}
    {renderRepair(color, logoPermitted, text5, repairCheckboxes, clientLogo)}
  </Document>
);

doc.propTypes = {
  text1: PropTypes.string,
  text2: PropTypes.string,
  text3: PropTypes.string,
  text4: PropTypes.string,
  text5: PropTypes.string,
};
