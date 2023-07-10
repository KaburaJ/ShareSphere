const express = require('express');
const session = require('express-session');
const logicRoutes = express.Router();
const getAllUsers = require('../controllers/allUsers');
const getAllPosts = require('../controllers/allPosts');
const EditUsername = require('../controllers/EditUserName');
const DeleteAccount = require('../controllers/deleteAccount');
const CreateProfile = require('../controllers/createProfile');
const ViewComments = require('../controllers/viewComments');
const CommentOnAPost = require('../controllers/commentOnAPost');
const CommentsCounterPerPost = require('../controllers/CommentsCounterPerPost');
const ViewReplies = require('../controllers/ViewReplies');
const ReplyCounterPerComment = require('../controllers/ReplyCounterPerComment');
const ReplyOnAComment = require('../controllers/ReplyOnAComment');
const ViewFollowers = require('../controllers/viewFollowers');
const FollowUser = require('../controllers/followUser');
const UnfollowUser = require('../controllers/unfollowUser');
const FollowerCountPerUser = require('../controllers/FollowerCountPerUser');
const ReactToPostCommentReply = require('../controllers/ReactToPostCommentReply');
const DeleteReaction = require('../controllers/DeleteReaction');
const ViewUserActivity = require('../controllers/ViewUserActivity');
const CreateNewPost = require('../controllers/CreateNewPost');
const SearchUsersByUsername = require('../controllers/search');
const EditUserProfile = require('../controllers/EditUserProfile');
const GetPostDetails = require('../controllers/GetPostDetails');
const DeletePostWithCommentsAndReactions = require('../controllers/DeletePostWithCommentsAndReactions');
require('dotenv').config()



logicRoutes.get('/users', getAllUsers);
logicRoutes.get('/posts', getAllPosts);
logicRoutes.post('/posts', CreateNewPost);
logicRoutes.put('/user/editusername', EditUsername);
logicRoutes.delete('/user/deleteaccount', DeleteAccount);
logicRoutes.post('/user/profile', CreateProfile);
logicRoutes.post('/user/profile/edit', EditUserProfile);
logicRoutes.post('/comments', ViewComments);
logicRoutes.post('/comments', CommentOnAPost);
logicRoutes.get('/comments/:id', CommentsCounterPerPost);
logicRoutes.get('/viewreplies/:id', ViewReplies);
logicRoutes.get('/replies/:id', ReplyCounterPerComment);
logicRoutes.post('/replies', ReplyOnAComment);
logicRoutes.get('/follower/:id', ViewFollowers);
logicRoutes.post('/follow', FollowUser);
logicRoutes.post('/unfollow', UnfollowUser);
logicRoutes.get('/followers/:id', FollowerCountPerUser);
logicRoutes.put('/react', ReactToPostCommentReply);
logicRoutes.delete('/react/delete', DeleteReaction);
logicRoutes.get('/activity/:id', ViewUserActivity);
logicRoutes.post('/search', SearchUsersByUsername);
logicRoutes.post('/postdetails', GetPostDetails);
logicRoutes.delete('/deletepost', DeletePostWithCommentsAndReactions);

module.exports = logicRoutes;
