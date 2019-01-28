import React from 'react';
import PropTypes from 'prop-types';

import redColor from '@material-ui/core/colors/red';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import _ from 'lodash';

const SwitchUI = (allProps) => {
  const {
    label,
    onChange,
    checked,
    value,
    style,
    ...props
  } = allProps;

  const styleClasses = {
    switchBase: style.switchColorBase || redColor[300],
    checked: style.colorChecked || redColor[500],
    bar: style.colorBar || redColor[500],
  };

  const SwitchChild = (<Switch
    value={value}
    onChange={onChange}
    checked={checked}
    id={`${_.camelCase(value)}label`}
    classes={styleClasses}
    {...props}
  />);

  return (<FormControlLabel label={label} control={SwitchChild} />);
};

SwitchUI.propTypes = {
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
  style: PropTypes.object,
  checked: PropTypes.bool,
};

SwitchUI.defaultProps = {
  style: {},
};

export default SwitchUI;
