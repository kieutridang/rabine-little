import React from 'react';
import PropTypes from 'prop-types';

import HorizontalLinearStepper from '../../../../components/Stepper/HorizontalLinearStepper';


const generatorSteps = ({
    activeStep,
    handleChangeStep,
    payload,
    steps,
}) => (
  <HorizontalLinearStepper
    showTitle
    steps={steps}
    activeStep={activeStep}
    api={handleChangeStep}
    createPayload={payload}
  />
    );

generatorSteps.propTypes = {
  activeStep: PropTypes.number,
  payload: PropTypes.func,
  handleChangeStep: PropTypes.func,
  steps: PropTypes.array,
};

export default generatorSteps;
