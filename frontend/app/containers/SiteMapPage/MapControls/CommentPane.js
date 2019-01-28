import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { compose } from 'redux';
import MuiSwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import IconButton from '@material-ui/core/IconButton';
import MuiCloseIcon from '@material-ui/icons/Close';
import { createStructuredSelector } from 'reselect';

import CommentEditor from './CommentEditor';
import CommentList from './CommentList';
import { actions } from '../../../appReducer/comment.reducer';
import { makeSelectError } from '../../../appSelector/comment';

export const ContentPane = styled.div`
  width: ${(props) => props.fullWidth ? '100%' : '20.3125rem'};
  height: 100%;
  background-color: #212223;
  box-shadow: 2px 2px 4px 0 rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
`;

const ContentPaneHeader = styled.div`
  flex: 0 0 auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0.125rem 0.5rem 0.125rem 1rem;
  border-bottom: solid 2px hsla(240, 3%, 37%, 0.16);
`;

export const ContentPaneBody = styled.div`
  overflow: auto;
  flex: 1 1 auto;
`;

export const ContentPaneEditor = styled.div`
  flex: 0 0 auto;
  padding: 0.75rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-top: solid 2px hsla(240, 3%, 37%, 0.16);
`;

const ContentPaneHeaderTitle = styled.span`
  font-size: 1rem;
`;

const CloseIcon = styled(MuiCloseIcon)`
  color: white;
  opacity: 0.5;
`;

const SwipeableDrawer = styled(MuiSwipeableDrawer)`
  color: white;
`;

const CommentPane = ({
  isOpen,
  toggleDrawer,
  deleteComment,
  readOnly,
  siteId,
  comments,
  serverError,
  addComment,
  addSharedComment,
}) => (
  <SwipeableDrawer
    anchor="right"
    open={isOpen}
    onClose={toggleDrawer(false)}
    onOpen={toggleDrawer(true)}
  >
    <ContentPane>
      <ContentPaneHeader>
        <ContentPaneHeaderTitle>COMMENTS</ContentPaneHeaderTitle>
        <IconButton color="default" onClick={toggleDrawer(false)}>
          <CloseIcon />
        </IconButton>
      </ContentPaneHeader>

      <ContentPaneBody>
        <CommentList
          comments={comments}
          deleteComment={deleteComment}
          enableDelete={!readOnly}
        />
      </ContentPaneBody>

      <ContentPaneEditor>
        <CommentEditor
          readOnly={readOnly}
          id={siteId}
          serverError={serverError}
          addComment={addComment}
          addSharedComment={addSharedComment}
        />
      </ContentPaneEditor>
    </ContentPane>
  </SwipeableDrawer>
);

CommentPane.propTypes = {
  isOpen: PropTypes.bool,
  toggleDrawer: PropTypes.func,
  readOnly: PropTypes.bool,
  siteId: PropTypes.string,
  comments: PropTypes.array,
  deleteComment: PropTypes.func,
  serverError: PropTypes.string,
  addComment: PropTypes.func,
  addSharedComment: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  serverError: makeSelectError(),
});

const mapDispatchToProps = (dispatch) => ({
  addComment: (payload) => dispatch(actions.createCommentRequest(payload)),
  addSharedComment: (payload) => dispatch(actions.createSharedCommentRequest(payload)),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withConnect,
)(CommentPane);
