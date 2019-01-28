// vendor
import React from 'react';
import PropTypes from 'prop-types';

// app
import Stepper from './Stepper';
import Step from './Step';
import StepLabel from './StepLabel';
import SvgCompleteIcon from '../Icon/SvgCompleteIcon';

class HorizontalLinearStepper extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      activeStepIndex: props.activeStep,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.activeStep !== nextProps.activeStep) {
      this.setState({ activeStepIndex: nextProps.activeStep });
    }
  }

  handleChangeStep = (newStatus) => {
    const {
      activeStepIndex,
    } = this.state;

    const {
      api,
      createPayload,
      steps,
    } = this.props;

    const oldActiveStepIndex = activeStepIndex;
    const oldActiveStep = steps[oldActiveStepIndex];

    const newActiveStatusIndex = steps.findIndex((step) => step.value === newStatus);
    const newActiveStep = steps[newActiveStatusIndex];

    if (oldActiveStepIndex === newActiveStatusIndex) return;

    if (api && createPayload) {
      const payload = createPayload(oldActiveStep.value, newActiveStep.value);
      api(payload);
    } else {
      this.setState({ activeStepIndex: newActiveStatusIndex });
    }
  }

  render() {
    const {
      showTitle,
      steps,
    } = this.props;

    const {
      activeStepIndex,
    } = this.state;

    return (
      <Stepper activeStep={activeStepIndex}>
        {
          steps.map((step) => (
            <Step key={step.value} icon={SvgCompleteIcon} name={step.value} onClick={this.handleChangeStep}>
              <StepLabel showTitle={showTitle}>
                {step.text}
              </StepLabel>
            </Step>
          ))
        }
      </Stepper>
    );
  }
}

HorizontalLinearStepper.propTypes = {
  showTitle: PropTypes.bool,
  steps: PropTypes.array,
  activeStep: PropTypes.number,
  api: PropTypes.func,
  createPayload: PropTypes.func,
};

HorizontalLinearStepper.defaultProps = {
  showTitle: true,
};

export default HorizontalLinearStepper;
