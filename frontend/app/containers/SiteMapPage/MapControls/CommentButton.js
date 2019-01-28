import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import styled from 'styled-components';

import CommentIcon from '../../../images/icons/comment.svg';
import CommentPane from './CommentPane';
import { actions } from '../../../appReducer/comment.reducer';
import { makeSelectComments, makeSelectError } from '../../../appSelector/comment';

const CommentWrapper = styled.div`
  width: 141px;
  height: 31px;
  background-color: #212223;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.3);
  position: absolute;
  bottom: 31px;
  right: 19px;
  z-index: 9999;
  border-radius: 4px;
  padding: 0 1rem;
  cursor: pointer;

  display: flex;
  flex-direction: row;
  align-items: center;
`;

const CommentButtonText = styled.span`
  color: #edeced;
  font-size: 13px;
  margin-left: 12px;
`;

class CommentButton extends Component {
  state = {
    isOpen: false,
  }

  componentWillMount() {
    const { getComments, siteId } = this.props;
    if (getComments && siteId) getComments(siteId);
  }

  toggleDrawer = (isOpen) => (e) => {
    e.preventDefault();
    this.setState({ isOpen });
  }

  handleDeleteComment = (commentId) => {
    const { deleteComment, siteId } = this.props;
    if (deleteComment && siteId) {
      deleteComment(siteId, commentId);
    }
  }

  render() {
    const { readOnly, siteId, comments } = this.props;
    const { isOpen } = this.state;

    const numberOfComments = comments ? comments.length : 0;

    return (
      <Fragment>
        <CommentWrapper onClick={this.toggleDrawer(true)} className="CommentButtonWrapper">
          <CommentIcon />
          <CommentButtonText>
            {`${numberOfComments} Comments`}
          </CommentButtonText>
        </CommentWrapper>

        <CommentPane
          siteId={siteId}
          readOnly={readOnly}
          isOpen={isOpen}
          comments={comments}
          deleteComment={this.handleDeleteComment}
          toggleDrawer={this.toggleDrawer}
        />
      </Fragment>
    );
  }
}

CommentButton.propTypes = {
  comments: PropTypes.array,
  readOnly: PropTypes.bool,
  siteId: PropTypes.string,
  getComments: PropTypes.func,
  deleteComment: PropTypes.func,
};

CommentButton.defaultProps = {
  numberOfComments: 0,
};

const mapStateToProps = createStructuredSelector({
  comments: makeSelectComments(),
  errorComments: makeSelectError(),
});

const mapDispatchToProps = (dispatch) => ({
  getComments: (siteId) => dispatch(actions.getCommentsRequest({ siteId })),
  deleteComment: (siteId, commentId) => dispatch(actions.deleteCommentRequest({ siteId, commentId })),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default withConnect(CommentButton);
