import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';

const styles = () => ({
  root: {
    marginBottom: '1.25rem',
    minHeight: '4rem',
  },
});

const ExpansionPanel = ({ children, classes, ...rest }) => (
  <MuiExpansionPanel className={classes.root} {...rest}>
    { children }
  </MuiExpansionPanel>
);

ExpansionPanel.propTypes = {
  children: PropTypes.any,
  classes: PropTypes.object,
};

export default withStyles(styles)(ExpansionPanel);

