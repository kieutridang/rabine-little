import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import styled from 'styled-components';
import DeleteIcon from '../../../images/icons/delete.svg';

const StyledComment = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.75rem 1rem;
  border-bottom: solid 2px hsla(240, 3%, 37%, 0.16);
  cursor: pointer;
  color: white;
  background-color: ${(props) => props.selected && '#191919'};
  &:hover {
    background-color: #191919;
  }
`;

const StyledCommentTitle = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const StyledCommentAuthor = styled.span`
  font-size: 14px;
  font-weight: 600;
`;

const StyledCommentTime = styled.span`
  font-size: 11px;
  font-weight: 200;
  opacity: 0.5;
  margin-right: 0.5rem;
`;

const StyledCommentCont = styled.span`
  word-break: break-all;
  margin-top: 5px;
  font-size: 11px;
  opacity: 0.5;
`;

const StyledTimeWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const getTimeAgo = (time) => {
  if (!time) return '';
  const expiration = moment(time);
  return expiration.fromNow() || '';
};

const Icon = styled(DeleteIcon)`
  color: white;
  opacity: 0.5;
  width: 10px;
  height: 10px;

  &:hover {
    opacity: 1;
  }
`;

const CommentListItem = ({ id, selected, authorName, createdDate, comment, deleteComment, enableDelete }) => {
  const handleDelete = () => deleteComment(id);
  return (
    <StyledComment selected={selected}>
      <StyledCommentTitle>
        <StyledCommentAuthor>{authorName}</StyledCommentAuthor>
        <StyledTimeWrapper>
          <StyledCommentTime>{getTimeAgo(createdDate)}</StyledCommentTime>
          {enableDelete && <Icon onClick={handleDelete} />}
        </StyledTimeWrapper>
      </StyledCommentTitle>

      <StyledCommentCont>
        {comment}
      </StyledCommentCont>
    </StyledComment>
  );
};

CommentListItem.propTypes = {
  selected: PropTypes.bool,
  authorName: PropTypes.string,
  createdDate: PropTypes.string,
  comment: PropTypes.string,
  id: PropTypes.string,
  deleteComment: PropTypes.func,
  enableDelete: PropTypes.bool,
};

export default CommentListItem;
