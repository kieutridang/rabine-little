import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import { RepairPhotosWrapper, RepairPhoto, PhotoWrapper } from './styled';

const RepairPhotoComponent = ({ repair = {}, info = {}, photo = {} }) => (
  <RepairPhoto>
    <p>{info.title} - {repair} ({info.zone}) </p>
    { !isEmpty(photo) && <PhotoWrapper src={photo.croppedUrl || photo.thumbnailUrl} /> }
  </RepairPhoto>
);

RepairPhotoComponent.propTypes = {
  repair: PropTypes.string.isRequired,
  info: PropTypes.object.isRequired,
  photo: PropTypes.object,
};

const RepairPhotosTab = (props) => {
  const { repairs } = props;
  const mapper = (repair) => repairs[repair].map((info, index) => {
    let photos = info.repairPhotos;

    if (photos.length === 0) {
      return <RepairPhotoComponent repair={repair} key={`${info.id}-${index}-${Math.random()}-${new Date()}`} info={info} />; // eslint-disable-line
    } else if (
      info.repairType &&
      info.repairType.match(/(Capital)/i) &&
      info.repairPhotos.length > 2
    ) {
      photos = [info.repairPhotos[0], info.repairPhotos[1]];
    } else if (
      info.repairType &&
      info.repairType.match(/(Maintenance)/i) &&
      info.repairPhotos.length > 1
    ) {
      photos = [info.repairPhotos[0]];
    }
    return photos.map((photo) => (
      <RepairPhotoComponent
        repair={repair}
        photo={photo}
        info={info}
        key={photo.id}
      />
    ));
  });

  return (
    <RepairPhotosWrapper>
      {Object.keys(repairs).map(mapper)}
    </RepairPhotosWrapper>
  );
};

RepairPhotosTab.propTypes = {
  repairs: PropTypes.object.isRequired,
};

export default RepairPhotosTab;
