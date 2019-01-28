import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import CommentListItem from './CommentListItem';

class CommentList extends React.Component {
  state = {
    selectedCommentId: null,
  }

  render() {
    const { comments, deleteComment, enableDelete } = this.props;
    const { selectedCommentId } = this.state;

    return comments ? (
      <Fragment>
        {
          comments.map(({ id, authorName, comment, createdDate }) => {
            const selected = selectedCommentId && selectedCommentId === id;

            return (
              <CommentListItem
                key={id}
                id={id}
                authorName={authorName}
                comment={comment}
                createdDate={createdDate}
                selected={selected}
                deleteComment={deleteComment}
                enableDelete={enableDelete}
              />
            );
          })
        }
      </Fragment>
    ) : null;
  }
}

CommentList.propTypes = {
  comments: PropTypes.array,
  deleteComment: PropTypes.func,
  enableDelete: PropTypes.bool,
};

CommentList.defaultProps = {
  enableDelete: true,
};

export default CommentList;
