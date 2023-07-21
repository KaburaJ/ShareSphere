import React from 'react';
import './styles/comments.css';

export const Comments = ({ profileImage, commenterName, comments }) => {
  if (!comments || comments.length === 0) {
    return <p>No comments available.</p>;
  }

  return (
    <div className="comments-container" style={{ maxWidth: "90%" }}>
      <h1>Comments</h1>

      <ul id="comments-list" className="comments-list">
        {comments.map((comment) => (
          <li key={comment.CommentID}>
            <div className="comment-main-level">
              <div className="comment-avatar">
                <img src={profileImage} alt="" />
              </div>

              <div className="comment-box">
                <div className="comment-head">
                  <h6 className="comment-name by-author">
                    <a href="#">{commenterName}</a>
                  </h6>
                  <span>{(comment.timestamp).slice(0, 10)}</span>
                  {/* Add the react/like button here for each comment */}
                  {/* For example, you can use the 'LikeButton' component here */}
                </div>
                <div className="comment-content">
                  {comment.CommentDescription}
                </div>
              </div>
            </div>

            {/* Render replies here if available */}
            {comment.Replies && comment.Replies.length > 0 && (
              <ul className="comments-list reply-list">
                {comment.Replies.map((reply) => (
                  <li key={reply.ReplyID}>
                    <div className="comment-avatar">
                      <img src={profileImage} alt="" />
                    </div>

                    <div className="comment-box">
                      <div className="comment-head">
                        <h6 className="comment-name">
                          <a href="#">{commenterName}</a>
                        </h6>
                        <span>{(reply.timestamp).slice(0, 10)}</span>
                        {/* Add the react/like button here for each reply */}
                      </div>
                      <div className="comment-content">
                        {reply.ReplyDescription}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
