import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./styles/posts.css";
import "./styles/singlePost.css";
import profile from "../images/avartar.png";
import { CommentModal } from "./commentsUpload";
import DeleteReactionButton from "./unreact";
import ReactButton from "./react";
import { useDarkMode } from "./darkModeContext";

const SinglePost = () => {
  const postId = useParams();
  const [post, setPost] = useState({});
  const [showCommentPopup, setShowCommentPopup] = useState(false);
  const [showReplyPopup, setShowReplyPopup] = useState(false);
  const [commentId, setCommentId] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const [darkMode] = useDarkMode()

  const navigate = useNavigate();

  const handleReplySubmit = async () => {
    let data = {
      CommentID: commentId,
      ReplyDescription: replyText,
    };
    try {
      await axios.post("http://localhost:5003/replies", data, {
        withCredentials: true,
      });
      setIsReplying(false);
      setReplyText("");
      fetchSinglePost();
    } catch (error) {
      console.error("Error submitting reply:", error);
    }
  };

  const handleCommentSubmit = async () => {
    let data = {
      PostID: postId.postId,
      CommentDescription: commentText,
    };
    try {
      await axios.post("http://localhost:5003/comments", data, {
        withCredentials: true,
      });
      setIsCommenting(false);
      setCommentText("");
      fetchSinglePost();
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  const handleReplyButtonClick = (commentId) => {
    setCommentId(commentId);
    setIsReplying(true);
  };

  const fetchSinglePost = async () => {
    const data = {
      PostID: postId.postId,
    };
    try {
      const response = await axios.post("http://localhost:5003/postdetails", data, {
        withCredentials: true,
      });
      setPost(response.data.results[0]);
    } catch (error) {
      console.error("Error fetching single post:", error);
    }
  };

  useEffect(() => {
    fetchSinglePost();
  }, [postId]);

  const updateReactions = async (reactionType, reacted, categoryID, isReply) => {
    if (reacted) {
      // Delete reaction
      try {
        await axios.delete("http://localhost:5003/react/delete", {
          data: {
            Category: isReply ? "Reply" : "Comment",
            ReactionType: reactionType,
            CategoryID: categoryID,
          },
          withCredentials: true,
        });
        fetchSinglePost();
      } catch (error) {
        console.error("Error deleting reaction:", error);
      }
    } else {
      // React to comment or reply
      try {
        await axios.post(
          "http://localhost:5003/react",
          {
            Category: isReply ? "Reply" : "Comment",
            ReactionType: reactionType,
            CategoryID: categoryID,
          },
          {
            withCredentials: true,
          }
        );
        fetchSinglePost();
      } catch (error) {
        console.error("Error reacting:", error);
      }
    }
  };

  
  return (
    <div style={darkMode ? { backgroundColor: "black", color: "white", height:"100vh" } : { backgroundColor:"#F4E4EC", height:"100vh"  }}>
      <div style={{ borderRadius: "20px", marginLeft: "15em" }} className={`post-container ${darkMode ? 'post-container' : ''}`}>
        <div className="post-content" style={{ backgroundColor: "white" }}>
          <div className="post-metadata">
            <div className="post-naming" style={{ marginLeft: "1.4em" }}>
              <img src={post.ProfileImage || profile} alt={post.UserName} className="poster-image" />
              <div className="user-details">
                <p className="username">{post.UserName}</p>
                <span className="post-date" style={{ marginLeft: "1em", marginBottom: ".6em" }}>{post.timestamp}</span>
              </div>
            </div>
          </div>
          <div className="post-content" style={{ marginTop: "-2em" }}>
            {post.PostDescription}<br></br>
            {post.PostURL && (
              <div >
                {post.PostURL.endsWith('.jpg') || post.PostURL.endsWith('.jpg') || post.PostURL.endsWith('.jpeg') || post.PostURL.endsWith('.png') ? (
                  <img src={post.PostURL} alt="" className="post-image" style={{ height: "39.2vh" }} />
                ) : post.PostURL.endsWith('.mp4') || post.PostURL.endsWith('.mp3') || post.PostURL.endsWith('.gif') ? (
                  <video controls src={post.PostURL} alt="" className="post-image" />
                ) : null}
              </div>
            )}
          </div>
          {showCommentPopup && (
            <div className="comment-input-field">
              <textarea
                placeholder="Write your comment here..."
                style={{ height: "3em", marginLeft: ".9em", width: "28em", marginTop: "-2em" }}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <button onClick={handleCommentSubmit} style={{ marginLeft: ".9em", marginRight: "1em" }}>Submit</button>
              <button onClick={() => setShowCommentPopup(false)}>Cancel</button>
            </div>
          )}
          {isCommenting ? (
            <div className="comment-input-field">
              <textarea
                placeholder="Write your comment here..."
                style={{ height: "3em", marginLeft: ".9em", width: "28em", marginTop: "-2em" }}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <button onClick={handleCommentSubmit} style={{ marginLeft: ".9em", marginRight: "1em" }}>Submit</button>
              <button onClick={() => setIsCommenting(false)}>Cancel</button>
            </div>
          ) : (
            <button className="comment-button" onClick={() => setIsCommenting(true)} style={{ marginLeft: "1.4em" }}>
              Comment
            </button>
          )}
        </div>
        <div className="comment-container" style={{ marginTop: "-1em", marginLeft: "-1em" }}>
          {post.Comments && post.Comments.map((comment) => (
            <div key={comment.CommentID} className="comment-box" style={{ width: "30em" }}>
              <img src={comment.ProfileImage || profile} alt={comment.UserName} className="commenter-image" />
              <div className="comment-content">{comment.CommentDescription}</div>
              {comment.Reactions && comment.Reactions.Comment && (
                <div className="reaction-content">
                  <ReactButton
                    Category="Comment"
                    ReactionType="Like"
                    CategoryID={comment.CommentID}
                    updateReactions={updateReactions}
                  />
                  <ReactButton
                    Category="Comment"
                    ReactionType="Love"
                    CategoryID={comment.CommentID}
                    updateReactions={updateReactions}
                  />
                  <ReactButton
                    Category="Comment"
                    ReactionType="Celebrate"
                    CategoryID={comment.CommentID}
                    updateReactions={updateReactions}
                  />
                </div>
              )}
              {isReplying && commentId === comment.CommentID ? (

                <div className="reply-input-field">
                  <textarea
                    placeholder="Write your reply here..."
                    style={{ height: "3em", marginLeft: ".1em", width: "22em", marginTop: "1em" }}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                  <button onClick={handleReplySubmit} style={{ marginLeft: ".6em", marginRight: "1em" }}>Submit</button>
                  <button onClick={() => setIsReplying(false)}>Cancel</button>
                </div>
              ) : (
                <button className="reply-button" onClick={() => handleReplyButtonClick(comment.CommentID)}>
                  Reply
                </button>
              )}
              {/* Display replies */}
              {comment.Replies && comment.Replies.map(reply => (
                <div key={reply.ReplyID} className="reply-box">
                  <div>
                    <img src={reply.ProfileImage || profile} alt={reply.UserName} className="commenter-image" />
                    {reply.ReplyDescription}
                  </div>
                  {reply.Reactions && reply.Reactions.Reply && (
                    <div className="reaction-content">
                      <ReactButton
                        Category="Reply"
                        ReactionType="Like"
                        CategoryID={reply.ReplyID}
                        updateReactions={updateReactions}
                      />
                      <ReactButton
                        Category="Reply"
                        ReactionType="Love"
                        CategoryID={reply.ReplyID}
                        updateReactions={updateReactions}
                      />
                      <ReactButton
                        Category="Reply"
                        ReactionType="Celebrate"
                        CategoryID={reply.ReplyID}
                        updateReactions={updateReactions}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Comment Popup */}
      {showCommentPopup && (
        <div className="popup">
          <div className="popup-content">
            <h2>Comment Popup</h2>
            { }
            <button onClick={() => setShowCommentPopup(false)}>Close</button>
          </div>
        </div>
      )}

      {/* Reply Popup */}
      {showReplyPopup && (
        <div className="popup">
          <div className="popup-content">
            <h2>Reply Popup</h2>
            {replyText}
            <button onClick={() => setShowReplyPopup(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SinglePost;
