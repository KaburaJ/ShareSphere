import React, { useEffect, useState, useMemo } from "react";
import "./styles/posts.css";
import axios from 'axios';
import {
  faThumbsUp,
  faHeart,
  faHandsClapping,
  faEllipsisV,
  faCloud,
  faSave,
  faNoteSticky,
  faBookmark,
  faComment
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Comments } from "./comments";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CommentModal } from "./commentsUpload";

export function PostsContent() {
  const [posts, setPosts] = useState([]);
  const [reactionType, setReactionType] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [isIconsHovered, setIsIconsHovered] = useState(false);
  const [posterDetails, setPosterDetails] = useState([]);
  const [commentSection, setCommentSection] = useState(false);
  const [profileImage, setProfileImage] = useState('');
  const [commenterName, setCommenterName] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [comment, setComment] = useState('')
  const [commentHierachy, setCommentHierachy] = useState('')
  const [fetchedComments, setFetchedCommnts] = useState([])
  const [commentsCount, setCommentsCount] = useState(0);
  const [reactionCount, setReactionCount] = useState(0);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [openCommentModalPostID, setOpenCommentModalPostID] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);


  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:5003/posts', {
        withCredentials: true,
      });
      setPosts(response.data);
      toast.success('Welcome to ShareSphere!', {
        position: 'top-center',
        autoClose: 3000,
      });
    } catch (error) {
      console.error(error);
      toast.error('Verify your email to proceed!', {
        position: 'top-center',
        autoClose: 3000
      })
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosterDetails = async (post) => {
    try {
      const response = await axios.get('http://localhost:5003/viewprofile', {
        params: {
          UserID: post.UserID
        },
        withCredentials: true,
      });
      setPosterDetails((prevDetails) => [...prevDetails, response.data.results.recordsets[0][0]]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    posts.forEach((post) => fetchPosterDetails(post));
  }, [posts]);

  const react = async (post) => {
    const reactData = {
      Category: "Post",
      ReactionType: reactionType,
      CategoryID: post.PostID,
    };

    try {
      const response = await axios.post('http://localhost:5003/react', reactData, {
        withCredentials: true,
      });
      console.log(response.data.message);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchComments = async (post) => {
    const data = {
      PostID: post.PostID
    }
    try {
      const response = await axios.post(`http://localhost:5003/allcomments`, data, {
        withCredentials: true,
      });
      setFetchedCommnts((prevComments) => [...prevComments, response.data.results[0]]);
      // console.log(response.data.results[0]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    posts.forEach((post) => fetchComments(post));
  }, [posts]);

  const handleReactionClick = (type, post) => {
    setReactionType(type);
    react(post);
  };

  const handleButtonMouseEnter = () => {
    setIsHovered(true);
  };

  const handleButtonMouseLeave = () => {
    setIsHovered(false);
    setIsIconsHovered(false);
  };

  const handleIconMouseEnter = () => {
    setIsIconsHovered(true);
  };

  const handleIconMouseLeave = () => {
    setIsIconsHovered(false);
  };

  const handleCommentSubmit = async (post) => {
    let commentingData = {
      PostID: post.PostID,
      CommentDescription: comment
    }
    try {
      let response = await axios.post('http://localhost:5003/comments', commentingData, {
        withCredentials: true
      });
      setCommentHierachy(response.data)
      console.log(response.data);
    } catch (error) {
      console.error('Error commenting: ', error)
    }
  }

  const [likesCountMap, setLikesCountMap] = useState({});
  const [commentsCountMap, setCommentsCountMap] = useState({});

  // Function to fetch likes and comments count for a post
  const fetchCounts = async (post) => {
    try {
      const responseComments = await axios.get(`http://localhost:5003/comments/${post.PostID}`, {
        withCredentials: true,
      });
      const commentsCount = responseComments.data.results[0].CommentCount;

      const postData = {
        postID: post.PostID,
      };
      const responseLikes = await axios.post(`http://localhost:5003/postreactions`, postData, {
        withCredentials: true,
      });
      const likesCount = responseLikes.data.results.recordset[0].ReactionCount;

      // Update the state variables with the counts
      setLikesCountMap((prevLikesMap) => ({ ...prevLikesMap, [post.PostID]: likesCount }));
      setCommentsCountMap((prevCommentsMap) => ({ ...prevCommentsMap, [post.PostID]: commentsCount }));
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch counts when a new post is added or the component mounts
  useEffect(() => {
    posts.forEach((post) => fetchCounts(post));
  }, [posts]);

  const LikeButton = ({ post, poster }) => {
    useEffect(() => {
      const fetchCommentsCount = async () => {
        try {
          const response = await axios.get(`http://localhost:5003/comments/${post.PostID}`, {
            withCredentials: true,
          });
          setCommentsCount(response.data.results[0].CommentCount);
          // console.log(response.data.results[0].CommentCount);
          countPostReactions();
        } catch (error) {
          console.error(error);
        }
      };

      fetchCommentsCount();
    }, [post.PostID]);

    const countPostReactions = async () => {
      const postData = {
        postID: post.PostID,
      };
      try {
        const response = await axios.post(`http://localhost:5003/postreactions`, postData, {
          withCredentials: true,
        });
        setReactionCount(response.data.results.recordset[0].ReactionCount);
      } catch (error) {
        console.error(error);
      }
    };

    useEffect(() => {
      countPostReactions();
    }, []);

    const likesCount = likesCountMap[post.PostID] || 0;
    const commentsCount = commentsCountMap[post.PostID] || 0;

    return (
      <div
        className="like-button"
        onMouseEnter={handleButtonMouseEnter}
        onMouseLeave={handleButtonMouseLeave}
      >
        <div className="posts-icons" style={{ display: "flex", color: "#E38B00", marginRight: "22em" }}>
          <button className="like-icon" placeholder={likesCount} style={{ color: "#E38B00", backgroundColor: "transparent" }} >
            <div style={{ color: "#E38B00", gap: "5px" }}>
              <FontAwesomeIcon icon={faThumbsUp} />{likesCount}
            </div>
          </button>
          <button
            className="comments-icon"
            onClick={() => handleCommentIconClick(post)}
            placeholder={commentsCount}
          >
            <FontAwesomeIcon icon={faComment} />
            {commentsCount}
          </button>

          {/* Show the comment modal if showCommentModal is true */}
          {showCommentModal && (
            <CommentModal
              profileImage={poster?.ProfileImage}
              commenterName={poster?.UserName}
              onSubmit={(comment) => handleCommentSubmit(post, comment)}
            />
          )}
        </div>
        {isHovered && (
          <div
            className="hover-icons"
            onMouseEnter={handleIconMouseEnter}
            onMouseLeave={handleIconMouseLeave}
          >
            <FontAwesomeIcon icon={faThumbsUp} onClick={() => handleReactionClick("Like", post)} />
            <FontAwesomeIcon icon={faHeart} onClick={() => handleReactionClick("Love", post)} />
            <FontAwesomeIcon icon={faHandsClapping} onClick={() => handleReactionClick("Celebrate", post)} />
          </div>
        )}
      </div>
    );
  };

  const postsContent = useMemo(() => {
    return posts.map((post, index) => (
      <div className="posts" key={post.PostID} style={{ backgroundColor: "transparent", boxShadow: "2px 2px 2px 2px solid #ccc" }}>
        <div className="post-metadata">
          <div className="post-naming" >
            <img src={posterDetails[index]?.ProfileImage}
              alt={posterDetails[index]?.UserName} className="poster-image" />
            <div className="user-details" style={{ marginTop: "1em" }}>
              <p className="username" style={{ marginBottom: ".6em" }}>{posterDetails[index]?.UserName}</p>
              <span className="post-date" style={{ marginLeft: "1em", marginBottom: ".6em" }}>{(post.timestamp).slice(0, 10)}</span>
            </div>

            <FontAwesomeIcon
              className="more-icon"
              icon={faEllipsisV}
              style={{
                marginLeft: "29em", marginTop: "1em",
                color: "#E38B00", fontWeight: "bold", letterSpacing: ".1em"
              }}
            />
          </div>
        </div>
        <p
          style={{ color: "#c6b6b6", marginLeft: ".2em" }}>
          {/* <FontAwesomeIcon style={{ color: "#E38B00", marginRight: ".6em", marginTop: ".2em", marginBottom: ".2em" }} icon={faNoteSticky} /> */}
          {/* {posterDetails[index]?.ProfileDescription} */}
          <FontAwesomeIcon icon={faSave} style={{ color: "#E38B00", marginLeft: "27em" }} />
          <FontAwesomeIcon icon={faBookmark} style={{ color: "#E38B00", marginLeft: "1em", marginBottom: ".09em" }} />
        </p>
        <div className="post-content">
        {selectedPost === post && (
          <>
            {post.PostDescription}
          </>
        )}
      </div>
        <div className="post-content">
          {post.PostDescription}
        </div>
        {post.PostURL && (
          <>
            {post.PostURL.endsWith('.jpg') || post.PostURL.endsWith('.jpg') || post.PostURL.endsWith('.jpeg') || post.PostURL.endsWith('.png') ?
              (<img
                src={post.PostURL}
                alt=""
                className="post-image"
              />) : post.PostURL.endsWith('.mp4') || post.PostURL.endsWith('.mp3') || post.PostURL.endsWith('.gif') ? (
                <video controls
                  src={post.PostURL}
                  alt=""
                  className="post-image"
                />
              ) : null
            }
          </>
        )}
        <div className="options">
          <LikeButton className="like-button" post={post} poster={posterDetails[index]} />
        </div>
        {commentSection && (
          <>
            <div className="comment-box">
              <div className="comment-input" style={{ marginTop: "3em" }}>
                <input
                  type="text"
                  placeholder="Write a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <button onClick={() => handleCommentSubmit(post)}>Submit</button>
              </div>
            </div>
            <Comments
              profileImage={posterDetails[index]?.ProfileImage}
              commenterName={posterDetails[index]?.UserName}
              comments={fetchedComments[index]?.recordset}
            />
          </>
        )}
      </div>
    ));
  }, [posts, posterDetails, commentSection]);

  const createComment = async (post) => {
    let commentBody = {
      PostID: post.PostID,
      CommentDescription: commentContent
    };
    try {
      let response = await axios.post('http://localhost:5003/comments', commentBody, {
        withCredentials: true
      });
      setCommentContent(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error while commenting on post:', error);
    }
  };

  const handleCommentIconClick = (post) => {
    setProfileImage(posterDetails[post.PostID - 1]?.ProfileImage);
    setCommenterName(posterDetails[post.PostID - 1]?.UserName);
    setOpenCommentModalPostID(post.PostID);
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
  };

  return (
    <div className="one-post">
      {postsContent}
      {posts.map((post) =>
        openCommentModalPostID === post.PostID && (
          <CommentModal
            key={post.PostID}
            profileImage={posterDetails[post.PostID - 1]?.ProfileImage}
            commenterName={posterDetails[post.PostID - 1]?.UserName}
            onSubmit={(comment) => handleCommentSubmit(post, comment)}
          />
        )
      )}
      <ToastContainer />
    </div>
  );
}
