import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

class ConfirmDialog extends React.Component {
  state = {
    open: false,
  };

  handleClickOpen = () => {
    if (this.props.content) {
      this.setState({ open: true });
    } else {
      this.handleAction();
    }
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleAction = () => {
    const {
      action,
      params,
      callback,
    } = this.props;

    if (action && params) {
      action(...params);
      this.handleClose();

      if (callback) {
        callback();
      }
    }
  };

  render() {
    const {
      title,
      buttonText,
      content,
      component: Component,
    } = this.props;

    const { open } = this.state;

    return (
      <div>
        <Component onClick={this.handleClickOpen}>{buttonText}</Component>
        <Dialog
          open={open}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {content}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Disagree
            </Button>
            <Button onClick={this.handleAction} color="primary">
              Agree
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

ConfirmDialog.propTypes = {
  title: PropTypes.string,
  buttonText: PropTypes.string,
  content: PropTypes.string,
  component: PropTypes.any,
  action: PropTypes.func,
  callback: PropTypes.func,
  params: PropTypes.array,
};

ConfirmDialog.defaultProps = {
  component: Button,
};

export default ConfirmDialog;
