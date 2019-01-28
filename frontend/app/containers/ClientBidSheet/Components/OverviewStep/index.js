import React from 'react';
import PropTypes from 'prop-types';
import {
    OverviewContainer,
    LogoSelectorContainer,
    SiteLogo,
    InputsContainer,
    Rectangle,
    LogoSelector,
    LogoTitle,
    DeleteLogo,
} from './styled';

import ImageImporter from '../../../../components/ImageImporter';
import Inputs from './Inputs';
import Logo from '../../../../images/sitelogo.svg';

const overviewStep = ({
    handleChangeColor,
    handleChangeText,
    inputValues,
    handleFile,
    isLogoPermitted,
    changeLogoPermittedStatus,
}) => (
  <OverviewContainer>
    <LogoSelectorContainer>
      <LogoSelector>
        <LogoTitle>SITE LOGO</LogoTitle>
        <Rectangle>
          <DeleteLogo onClick={changeLogoPermittedStatus}><div> {isLogoPermitted ? '✖' : '✔' }</div></DeleteLogo>
          <SiteLogo>
            <Logo />
          </SiteLogo>
        </Rectangle>
      </LogoSelector>
      <LogoSelector>
        <LogoTitle>COMPANY LOGO</LogoTitle>
        <ImageImporter
          containerWidth={166}
          containerHeight={166}
          handleFile={handleFile}
        />

      </LogoSelector>
    </LogoSelectorContainer>
    <InputsContainer>
      <Inputs
        handleChangeColor={handleChangeColor}
        handleChangeText={handleChangeText}
        inputValues={inputValues}
      />
    </InputsContainer>
  </OverviewContainer>
    );

overviewStep.propTypes = {
  handleChangeColor: PropTypes.func,
  handleChangeText: PropTypes.func,
  inputValues: PropTypes.any,
  handleFile: PropTypes.func,
  isLogoPermitted: PropTypes.bool,
  changeLogoPermittedStatus: PropTypes.func,
};
export default overviewStep;
