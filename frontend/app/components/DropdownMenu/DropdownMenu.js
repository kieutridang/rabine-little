import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import './styles.css';

class DropdownMenu extends React.Component {
  state = { isOpen: null };

  handleOpenMenu = (event) => {
    const { currentTarget } = event;
    this.setState({ isOpen: currentTarget });
  };

  handleClickItem = (action) => () => {
    this.setState({ isOpen: null });

    if (action) {
      action();
    }
  };

  handleClose = () => {
    this.setState({ isOpen: null });
  };

  render() {
    const { isOpen } = this.state;
    const { options } = this.props;

    return (
      <div>
        <IconButton
          aria-label="More"
          aria-owns={isOpen ? 'long-menu' : null}
          aria-haspopup
          onClick={this.handleOpenMenu}
          className="DropdownMenu__IconButton"
        >
          <MoreVertIcon className="DropdownMenu__IconButton-Icon" />
        </IconButton>
        <Menu
          id="long-menu"
          anchorEl={isOpen}
          open={Boolean(isOpen)}
          onClose={this.handleClose}
          PaperProps={{ style: { width: 200 } }}
        >
          {
            options.map((option) => {
              const { key, renderItem, action, title } = option;
              if (renderItem) {
                return renderItem(MenuItem, this.handleClose);
              }

              return (
                <MenuItem key={key} onClick={this.handleClickItem(action)}>
                  {title}
                </MenuItem>
              );
            })
          }
        </Menu>
      </div>
    );
  }
}

DropdownMenu.propTypes = {
  options: PropTypes.array,
};

export default DropdownMenu;
