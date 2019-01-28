import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
  Page,
  Text,
  View,
  Image,
} from '@react-pdf/renderer';

import separateArrays from '../../utils/separateArrays';
import {
  Info,
  Subtitle,
  Color,
} from './components/PDFComponents';

import ZoneTable from './components/PDFComponents/ZoneTable';
import RepairsTable from './components/PDFComponents/RepairsTable';

import styles from './pdfStyles';

import SiteLogo from '../../../../images/sitelogoblack.png';

const Document = 'DOCUMENT';

const renderLogoSection = (color, logoPermitted, clientLogo) => (
  <View style={[{ backgroundColor: color || '#272727' }, styles.header]} fixed >
    {
      clientLogo && clientLogo.blobUrl && <Image src={clientLogo.blobUrl} fixed style={styles.logoImageLeft} />
    }
    {
      logoPermitted ? <Image src={`${SiteLogo}`} fixed style={styles.logoImage} /> : null
    }
  </View>
);

const renderLeftContainer = (text1, placeHolderText = 'Property Screenshot', defaultStyle = [styles.sideContainer], screenshot) => (
  <View style={defaultStyle}>
    <View style={styles.pictureSide}>
      <Subtitle>{text1}</Subtitle>

      {screenshot ? <Image src={`${screenshot.bidSheetPhotoUrl}`} style={styles.pictureSideImage} /> :
      <View style={styles.screenshotPlaceholder}>
        <Text style={styles.screenshotPlaceholderText}>{placeHolderText}</Text>
      </View>
      }
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

const renderLogo = (color, logoPermitted, text1, text2, clientLogo, siteDetail, propertyScreenshot) => {
  const totalExteriorAsphalt = +siteDetail.totalExteriorAsphalt;
  const totalExteriorConcrete = +siteDetail.totalExteriorConcrete;
  const weightedPCI = +siteDetail.weightedPCI;

  return (
    <Page orientation="landscape">
      {renderLogoSection(color, logoPermitted, clientLogo)}
      <View style={styles.body}>
        { renderLeftContainer(text1 || 'Pavement Assessment Report', 'Property Screenshot', undefined, propertyScreenshot) }
        <RightContainer text2={text2 || 'Location Overview'} clientLogo={clientLogo} >
          <Info label="Site Address">
            { siteDetail.address }
          </Info>
          <Info label="Total exterior concrete">
            { totalExteriorConcrete.toLocaleString() }
          </Info>
          <Info label="Total exterior Asphalt">
            { totalExteriorAsphalt.toLocaleString() }
          </Info>
          <Info label="Location weighted pci">
            { weightedPCI.toLocaleString() }
          </Info>
        </RightContainer>
      </View>
    </Page>
  );
};

const renderZone = (color, logoPermitted, text3, text4, zoneCheckboxes, clientLogo, zones, index, zoneMapScreenshot) => (
  <Page orientation="landscape" key={index}>
    { renderLogoSection(color, logoPermitted, clientLogo) }
    <View style={styles.body}>
      { renderLeftContainer(text3 || 'Zone Map', 'Zone Map Screenshot', undefined, zoneMapScreenshot) }
      <RightContainer text2={text4 || 'Zone Information'} clientLogo={clientLogo} >
        <ZoneTable checkboxes={zoneCheckboxes} zones={zones} />
      </RightContainer>
    </View>
  </Page>
);

const renderRepair = (color, logoPermitted, text5, repairCheckboxes, clientLogo, repairs, year, repairScreenshot) => {
  const chunkRepairs = separateArrays(repairs, 5);
  return (
    <Page orientation="landscape" wrap key={year}>
      { renderLogoSection(color, logoPermitted, clientLogo) }

      { chunkRepairs.map((repairGroup, index) => (
        <View style={styles.body} key={`${new Date(index + year)}`} break={index > 0}>
          {
              renderLeftContainer(
                text5 || 'Repair Map',
                'Repair Map Screenshot',
                [styles.sideContainer, styles.shortLeftContainer],
                repairScreenshot
              )
            }

          <RightContainer
            text2={`${year} Repairs`}
            clientLogo={clientLogo}
            containerStyles={[styles.sideContainer, styles.rightContainer, styles.longRightContainer]}
          >
            <RepairsTable checkboxes={repairCheckboxes} repairs={repairGroup} />
          </RightContainer>
        </View>
        ))
      }
      { renderRepairsPictures(repairs, clientLogo) }
    </Page>
  );
};

const renderRepairsPictures = (repairs, clientLogo) => repairs.map((repair) => {
  const pictures = [];
  let repairPhotosCopy = _.cloneDeep(repair.repairPhotos);

  if ((repair.repairPhotos.length === 0) && !repair.title.match(/(restripe affected)/i)) {
    pictures.push(renderRepairPicture(repair, [{}, {}])); // adding array of objects placeholder images
  }

  if (repair.repairType.match(/(Capital)/i) && repairPhotosCopy.length > 2) {
    pictures.push(renderRepairPicture(repair, [repairPhotosCopy[0], repairPhotosCopy[1]], clientLogo));
    repairPhotosCopy = [];
  } else if (repair.repairType.match(/(Maintenance)/i) && repairPhotosCopy.length > 1) {
    pictures.push(renderRepairPicture(repair, [repairPhotosCopy[0]], clientLogo));
    repairPhotosCopy = [];
  }

  while ((repairPhotosCopy.length > 0) && !repair.title.match(/(restripe affected)/i)) {
    const chunk = repairPhotosCopy.splice(0, 2);

    pictures.push(renderRepairPicture(repair, chunk, clientLogo));
  }

  return pictures;
});

const renderRepairPicture = (repair, repairPhotos) => (
  <View break style={styles.body} key={`${repair.title}-${repair._id}-${new Date()}-${repairPhotos[0].id}-${Math.random()}`}>
    <View style={styles.sideContainer}>
      <View style={{ display: 'flex', flexDirection: 'row', width: '800px' }}>
        <Color color={repair.color} />
        <View style={{ flexGrow: 1 }}>
          <Subtitle> {`${repair.title} (${repair.qty} ${repair.unit})`} </Subtitle>
        </View>
        <View>
          <Subtitle> {repair.zone} </Subtitle>
        </View>
      </View>
      <View style={styles.pictureSide}>
        <Subtitle></Subtitle>
        { repairPhotos[0].croppedUrl && <Image src={repairPhotos[0].croppedUrl} style={styles.pictureSideImage} /> }
        { !repairPhotos[0].croppedUrl && repairPhotos[0].url && <Image src={repairPhotos[0].url} style={styles.pictureSideImage} /> }
        { !repairPhotos[0].url && (
          <View style={styles.screenshotPlaceholder}>
            <Text style={styles.screenshotPlaceholderText}>Repair Photo</Text>
          </View>
        )}
      </View>
    </View>
    { repairPhotos[1] && (
      <View style={styles.sideContainer}>
        <View style={{ flexDirection: 'row' }}><Subtitle /><Color /></View>
        <View style={styles.pictureSide}>
          <Subtitle></Subtitle>
          { repairPhotos[1].url && <Image src={repairPhotos[1].url} style={styles.pictureSideImage} /> }
          { !repairPhotos[1].url && (
            <View style={styles.screenshotPlaceholder}>
              <Text style={styles.screenshotPlaceholderText}>Repair Photo</Text>
            </View>
          )}
        </View>
      </View>
    )}
  </View>
);

export const doc = (
  { text1, text2, text3, text4, text5 },
  color,
  zoneCheckboxes,
  repairCheckboxes,
  clientLogo,
  logoPermitted,
  siteDetail,
  zones,
  repairs,
  toggledYears,
  zoneMapScreenshot,
  repairScreenshots,
  propertyScreenshot,
) => {
  const zonesCopy = _.cloneDeep(zones);
  const chunkZones = separateArrays(zonesCopy, 5);
  return (
    <Document title="BidSheet">
      { renderLogo(color, logoPermitted, text1, text2, clientLogo, siteDetail, propertyScreenshot) }
      { chunkZones.map((zonesGroup, index) => renderZone(color, logoPermitted, text3, text4, zoneCheckboxes, clientLogo, zonesGroup, index, zoneMapScreenshot)) }
      { toggledYears.map((year) => renderRepair(color, logoPermitted, text5, repairCheckboxes, clientLogo, repairs[year], year, repairScreenshots[year])) }
    </Document>
  );
};

doc.propTypes = {
  text1: PropTypes.string,
  text2: PropTypes.string,
  text3: PropTypes.string,
  text4: PropTypes.string,
  text5: PropTypes.string,
};
