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
const ViewNotifications = require('../controllers/ViewNotifications');
const ViewOtherUserActivity = require('../controllers/ViewOtherUserActivity copy');
const GetUserNameById = require('../controllers/getUserIdByUsername');
const DeleteNotification = require('../controllers/deleteNotification');
const MarkNotificationAsRead = require('../controllers/MarkNotificationAsRead');
const CountReactionsPerPost = require('../controllers/countPostReactions');
const DeleteProfile = require('../controllers/deleteProfile');
const GetProfile = require('../controllers/GetProfile');
const FollowingCountPerUser = require('../controllers/followingCount');
const PostsCount = require('../controllers/postsCount');
const SpecificUserDetails = require('../controllers/thatUserDetails');
const GetFollowedUsersPosts = require('../controllers/ForYou.js');
const SavePost = require('../controllers/savePost');
const getAllPeople = require('../controllers/allPeople');
const ViewOtherUserProfile = require('../controllers/otherUserProfile');
const NotificationsCount = require('../controllers/notificationsCount');
require('dotenv').config()



logicRoutes.get('/foryou', GetFollowedUsersPosts);
logicRoutes.get('/allusers', getAllUsers);
logicRoutes.get('/posts', getAllPosts);
logicRoutes.post('/posts', CreateNewPost);
logicRoutes.put('/user/editusername', EditUsername);
logicRoutes.delete('/user/deleteaccount', DeleteAccount);
logicRoutes.delete('/user/notification', DeleteNotification);
logicRoutes.delete('/deleteprofile', DeleteProfile)
logicRoutes.get('/viewprofile', GetProfile)
logicRoutes.post('/user/marknotification', MarkNotificationAsRead);
logicRoutes.post('/user/profile', CreateProfile);
logicRoutes.post('/user/profile/edit', EditUserProfile);
logicRoutes.post('/allcomments', ViewComments);
logicRoutes.post('/comments', CommentOnAPost);
logicRoutes.get('/comments/:id', CommentsCounterPerPost);
logicRoutes.get('/viewreplies/:id', ViewReplies);
logicRoutes.get('/replies/:id', ReplyCounterPerComment);
logicRoutes.post('/replies', ReplyOnAComment);
logicRoutes.get('/follower', ViewFollowers);//
logicRoutes.post('/follow', FollowUser);
logicRoutes.post('/unfollow', UnfollowUser);//
logicRoutes.get('/followers/:userid?', FollowerCountPerUser);
logicRoutes.get('/following/:userid?', FollowingCountPerUser);
logicRoutes.post('/react', ReactToPostCommentReply);
logicRoutes.get('/thatuser', SpecificUserDetails)
logicRoutes.post('/postreactions', CountReactionsPerPost)
logicRoutes.get('/postscount/:userid?', PostsCount)
logicRoutes.delete('/react/delete', DeleteReaction);
logicRoutes.get('/activity/', ViewUserActivity);//
logicRoutes.get('/activity/:id', ViewOtherUserActivity);//
logicRoutes.post('/search', SearchUsersByUsername);
logicRoutes.post('/postdetails', GetPostDetails);
logicRoutes.delete('/deletepost', DeletePostWithCommentsAndReactions);
logicRoutes.get('/notifications', ViewNotifications);//
logicRoutes.post('/userid', GetUserNameById);
logicRoutes.post('/save', SavePost)
logicRoutes.get('/people', getAllPeople)
logicRoutes.get('/profile/:username', ViewOtherUserProfile)
logicRoutes.get('/notificationscount', NotificationsCount)


module.exports = logicRoutes;
