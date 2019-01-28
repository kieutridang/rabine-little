import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import CommentList from '../MapControls/CommentList';
import CommentEditor from '../MapControls/CommentEditor';
import { actions } from '../../../appReducer/repairComment.reducer';
import { ContentPaneBody, ContentPane, ContentPaneEditor } from '../MapControls/CommentPane';

const RepairInfoSideMenuComment = ({
  comments,
  readOnly,
  repairId,
  addComment,
  addSharedComment,
}) => (
  <ContentPane fullWidth>
    <ContentPaneBody>
      <CommentList
        comments={comments}
        enableDelete={false}
      />
    </ContentPaneBody>

    <ContentPaneEditor>
      <CommentEditor
        readOnly={readOnly}
        id={repairId}
        addComment={addComment}
        addSharedComment={addSharedComment}
      />
    </ContentPaneEditor>
  </ContentPane>
);

RepairInfoSideMenuComment.propTypes = {
  readOnly: PropTypes.bool,
  repairId: PropTypes.string,
  comments: PropTypes.array,
  addComment: PropTypes.func,
  addSharedComment: PropTypes.func,
};

const mapDispatchToProps = (dispatch) => ({
  addComment: (payload) => dispatch(actions.createRepairCommentRequest(payload)),
  addSharedComment: (payload) => dispatch(actions.createRepairSharedCommentRequest(payload)),
  deleteComment: (repairInstanceId, commentId) => dispatch(actions.deleteRepairCommentRequest({ repairInstanceId, commentId })),
});

const withConnect = connect(null, mapDispatchToProps);

export default withConnect(RepairInfoSideMenuComment);
