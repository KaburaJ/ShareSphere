CREATE DATABASE ShareSphere
USE ShareSphere

CREATE TABLE Users(
    UserID uniqueidentifier DEFAULT NEWID() NOT NULL PRIMARY KEY,
    FirstName varchar(255),
    LastName varchar(255),
    UserName varchar(255) NOT NULL UNIQUE,
    UserAge INT,
    UserEmail varchar(255),
    UserPassword varchar(255),
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    AccountDeleted INT DEFAULT 0
)


CREATE TABLE Profile(
    ProfileID uniqueidentifier DEFAULT NEWID() NOT NULL PRIMARY KEY,
    UserID uniqueidentifier FOREIGN KEY REFERENCES Users(UserID),
    ProfileImage VARCHAR(MAX),
    UserName VARCHAR(255),
    ProfileDescription VARCHAR(255)
)

CREATE TABLE Posts(
    PostID uniqueidentifier DEFAULT NEWID() NOT NULL PRIMARY KEY,
    UserID uniqueidentifier FOREIGN KEY REFERENCES Users(UserID),
    PostURL VARCHAR(MAX),
    PostDescription VARCHAR(255),
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    Reaction INT DEFAULT 0
)

CREATE TABLE Comments(
    CommentID uniqueidentifier DEFAULT NEWID() NOT NULL PRIMARY KEY,
    UserID uniqueidentifier FOREIGN KEY REFERENCES Users(UserID),
    PostID uniqueidentifier FOREIGN KEY REFERENCES Posts(PostID),
    CommentDescription VARCHAR(255),
    Reaction INT DEFAULT 0,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
)

CREATE TABLE Replies(
    ReplyID uniqueidentifier DEFAULT NEWID() NOT NULL PRIMARY KEY,
    UserID uniqueidentifier FOREIGN KEY REFERENCES Users(UserID),
    CommentID uniqueidentifier FOREIGN KEY REFERENCES Comments(CommentID),
    ReplyDescription VARCHAR(255),
    Reaction INT DEFAULT 0,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
)

CREATE TABLE Reactions(
    ReactionID uniqueidentifier DEFAULT NEWID() NOT NULL PRIMARY KEY,
    UserID uniqueidentifier,
    Category VARCHAR(50),
    ReactionType VARCHAR(50),
    CategoryID uniqueidentifier,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    CONSTRAINT Category CHECK (Category IN ('Post', 'Comment', 'Reply')),
    CONSTRAINT ReactionType CHECK (ReactionType IN ('Like', 'Love', 'Celebrate')),
    CONSTRAINT UserCommentReaction UNIQUE(UserID, CategoryID),
    Deleted INT DEFAULT 0
)


CREATE TABLE Followers(
    FollowersID uniqueidentifier DEFAULT NEWID() NOT NULL PRIMARY KEY,
    Followed uniqueidentifier FOREIGN KEY REFERENCES Users(UserID),
    Follower uniqueidentifier FOREIGN KEY REFERENCES Users(UserID),
)


CREATE TABLE Notifications(
    NotificationsID uniqueidentifier DEFAULT NEWID() NOT NULL PRIMARY KEY,
    ReceipientID uniqueidentifier FOREIGN KEY REFERENCES Users(UserID),
    NotificationType VARCHAR(50),
    TimeNotified DATETIME DEFAULT CURRENT_TIMESTAMP,
	isRead BIT DEFAULT 0,
    Deleted BIT DEFAULT 0
)

DROP TABLE Users
DROP TABLE Profile
DROP TABLE Posts
DROP TABLE Comments
DROP TABLE Followers
DROP TABLE Reactions
DROP TABLE Replies
DROP TABLE Notifications


SELECT * FROM Users
SELECT * FROM Profile
SELECT * FROM Posts
SELECT * FROM Comments
SELECT * FROM Followers
SELECT * FROM Replies
SELECT * FROM Reactions
SELECT * FROM Categories


-- Generic Data
INSERT INTO Users (UserID, FirstName, LastName, UserName, UserAge, UserEmail, UserPassword)
VALUES
(NEWID(), 'James', 'Kamau', 'jamohkamah', 25, 'james.kamau@gmail.com', 'password123'),
(NEWID(), 'Sylvia', 'Mwende', 'slymama', 30, 'sylvia.mwende@gmail.com', 'pass123'),
(NEWID(), 'Michael', 'Omolo', 'mikeyo', 35, 'michael.omolo@gmail.com', 'qwerty'),
(NEWID(), 'Everlyn', 'Selelo', 'evelelo', 28, 'everlyn.selelo@gmail.com', 'abc123'),
(NEWID(), 'David', 'Mwiti', 'daveym', 32, 'david.mwiti@gmail.com', 'pass456');


INSERT INTO Posts (PostID, UserID, PostURL, PostDescription)
VALUES
(NEWID(), (SELECT UserID FROM Users WHERE UserName = 'jamohkamah'), 'https://sharesphere.com/post1', 'This is the first post.'),
(NEWID(), (SELECT UserID FROM Users WHERE UserName = 'jamohkamah'), 'https://sharesphere.com/post2', 'Check out my second post!'),
(NEWID(), (SELECT UserID FROM Users WHERE UserName = 'slymama'), 'https://sharesphere.com/post3', 'Sharing some exciting news!'),
(NEWID(), (SELECT UserID FROM Users WHERE UserName = 'mikeyo'), 'https://sharesphere.com/post4', 'Thoughts on the latest trends.'),
(NEWID(), (SELECT UserID FROM Users WHERE UserName = 'slymama'), 'https://sharesphere.com/post5', 'Reflecting on my journey.');


INSERT INTO Profile (ProfileID, UserID, ProfileImage, UserName, ProfileDescription)
VALUES
(NEWID(), (SELECT UserID FROM Users WHERE UserName = 'jamohkamah'), 'https://sharesphere.com/image1.jpg', 'jamohkamah', 'Clawing my way to the top!'),
(NEWID(), (SELECT UserID FROM Users WHERE UserName = 'slymama'), 'https://sharesphere.com/image2.jpg', 'slymama', 'Abracadabra'),
(NEWID(), (SELECT UserID FROM Users WHERE UserName = 'mikeyo'), 'https://sharesphere.com/image3.jpg', 'mikeyo', 'Now you cannot see me'),
(NEWID(), (SELECT UserID FROM Users WHERE UserName = 'evelelo'), 'https://sharesphere.com/image4.jpg', 'evelelo', 'Factoring in'),
(NEWID(), (SELECT UserID FROM Users WHERE UserName = 'daveym'), 'https://sharesphere.com/image5.jpg', 'daveym', 'Lover of life');


INSERT INTO Comments (CommentID, UserID, PostID, CommentDescription)
VALUES
(NEWID(), (SELECT UserID FROM Users WHERE UserName = 'jamohkamah'), (SELECT PostID FROM Posts WHERE PostDescription = 'This is the first post.'), 'Great post!'),
(NEWID(), (SELECT UserID FROM Users WHERE UserName = 'slymama'), (SELECT PostID FROM Posts WHERE PostDescription = 'This is the first post.'), 'I agree with you.'),
(NEWID(), (SELECT UserID FROM Users WHERE UserName = 'mikeyo'), (SELECT PostID FROM Posts WHERE PostDescription = 'Check out my second post!'), 'Nice work!'),
(NEWID(), (SELECT UserID FROM Users WHERE UserName = 'evelelo'), (SELECT PostID FROM Posts WHERE PostDescription = 'Check out my second post!'), 'Well said.'),
(NEWID(), (SELECT UserID FROM Users WHERE UserName = 'daveym'), (SELECT PostID FROM Posts WHERE PostDescription = 'Sharing some exciting news!'), 'Keep it up!');


INSERT INTO Replies (ReplyID, UserID, CommentID, ReplyDescription)
VALUES
(NEWID(), (SELECT UserID FROM Users WHERE UserName = 'daveym'), (SELECT CommentID FROM Comments WHERE CommentDescription = 'Well said.'), 'Keep it up!'),
(NEWID(), (SELECT UserID FROM Users WHERE UserName = 'jamohkamah'), (SELECT CommentID FROM Comments WHERE CommentDescription = 'Great post!'), 'Great post!'),
(NEWID(), (SELECT UserID FROM Users WHERE UserName = 'slymama'), (SELECT CommentID FROM Comments WHERE CommentDescription = 'Great post!'), 'I agree!'),
(NEWID(), (SELECT UserID FROM Users WHERE UserName = 'mikeyo'), (SELECT CommentID FROM Comments WHERE CommentDescription = 'Nice work!'), 'Nice work!'),
(NEWID(), (SELECT UserID FROM Users WHERE UserName = 'evelelo'), (SELECT CommentID FROM Comments WHERE CommentDescription = 'Nice work!'), 'Well said!'),



INSERT INTO Followers (FollowersID, Followed, Follower)
VALUES
(NEWID(), '374F8AD0-746E-4973-B213-D7997790911C', 'EBD43751-9ED5-476F-9AFA-C3E603279E6F'),
(NEWID(), '7E9C4D03-041D-4DA8-8D2E-72D1D8B507A0', 'FCB0A209-3C1A-4D12-9571-1E19BF3120A3'),
(NEWID(), '374F8AD0-746E-4973-B213-D7997790911C', 'EBD43751-9ED5-476F-9AFA-C3E603279E6F'),
(NEWID(), '80960AD1-B34D-405C-874A-1A77B55B4282', '7E9C4D03-041D-4DA8-8D2E-72D1D8B507A0'),
(NEWID(), 'FCB0A209-3C1A-4D12-9571-1E19BF3120A3', 'EBD43751-9ED5-476F-9AFA-C3E603279E6F')


INSERT INTO Reactions (ReactionID, UserID, Category, ReactionType, CategoryID)
VALUES
(NEWID(), (SELECT UserID FROM Users WHERE UserName = 'jamohkamah'), 'Post', 'Like', '020CF806-EBC2-4BDC-8907-0340FA92E69D'),
(NEWID(), (SELECT UserID FROM Users WHERE UserName = 'slymama'), 'Comment', 'Love', '3359C018-1177-4B5A-8ED7-20E6C912CA11'),
(NEWID(), (SELECT UserID FROM Users WHERE UserName = 'mikeyo'), 'Reply', 'Celebrate', 'D02976F8-C128-47F3-8CF5-70F702F9FF9E'),
(NEWID(), (SELECT UserID FROM Users WHERE UserName = 'evelelo'), 'Comment', 'Like', 'BF2160BF-C5BC-4556-83F6-3F8DEFCE059A'),
(NEWID(), (SELECT UserID FROM Users WHERE UserName = 'daveym'), 'Post', 'Celebrate', '1916BE5B-B983-4EB3-BA77-229F66C222E6');


SELECT * FROM Users
SELECT * FROM Profile
SELECT * FROM Posts
SELECT * FROM Comments
SELECT * FROM Followers
SELECT * FROM Replies
SELECT * FROM Reactions
SELECT * FROM Categories
SELECT * FROM Notifications


--All stored procedures
--Add a user
EXEC AddUser 'Marvin', 'Kibet', 'Kranium', 19, 'marvin.kibet@gmail.com', 'muasya*fc234'
SELECT * FROM Users

--Edit user name
EXEC EditUsername @userID=4, @newUserName='daveydavey';
SELECT * FROM Users

--Delete account
EXEC DeleteAccount @userID=8;
SELECT * FROM Users

--Creating a new post
EXEC CreateNewPost @userID=3, @postURL='https://posty.com/3', @PostDescription='Getting lost at Bermuda Triangle'
SELECT * FROM Posts
SELECT * FROM Notifications

--Viewing the followers' details of a user
SELECT * FROM Followers
EXEC ViewFollowers @userID=3

--Number of followers per user
EXEC dbo.FollowerCountPerUser @userID=3;

--Following a user
EXEC FollowUser @followedID=3, @followerID=8
SELECT * FROM Followers
SELECT * FROM Notifications

--Unfollow a user
EXEC UnfollowUser @followerID = 3, @followedID = 8
SELECT * FROM Followers
SELECT * FROM Notifications

--Comment on a post
EXEC CommentOnAPost @userID = 3, @postID = 3, @commentDescription = 'I think that is why it is illegal'
SELECT * FROM Comments
SELECT * FROM Notifications


--Number of comments per post 
EXEC dbo.CommentsCountPerPost @postId=3;

--Viewing replies per comment
SELECT * FROM Replies
EXEC ViewReplies @commentID =1

--Number of replies per comment
EXEC dbo.ReplyCountPerComment @commentID=3


--Reply on a comment(with notification)
EXEC ReplyOnAComment @userID=5, @commentID=2, @replyDescription='Woah, lucky'
SELECT * FROM Replies
SELECT * FROM Notifications

--Reacting
EXEC ReactToPostCommentReply @userID=8, @category='Post', @reactionType= 'Like', @categoryID=3
SELECT * FROM Reactions
SELECT * FROM Notifications

---Delete reaction
EXEC DeleteReaction @userID=8, @category='Post', @reactionType= 'Like', @categoryID=3
SELECT * FROM Reactions
SELECT * FROM Notifications

--View user activity
EXEC ViewUserActivity @userID=2


--Create profile
EXEC CreateProfile @profileImage ='https://profiley/331', @userName = 'daveym', @profileDescription = 'Just winging it'
SELECT * FROM Profile
