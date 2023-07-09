--Stored procedures
--Add user
CREATE PROCEDURE AddUser
    @FirstName varchar(255),
    @LastName varchar(255),
    @UserName varchar(255), 
    @UserAge int, 
    @UserEmail varchar(255), 
    @UserPassword varchar(255)
AS
BEGIN
    INSERT INTO Users (FirstName, LastName, UserName, UserAge, UserEmail, UserPassword)
    VALUES (@FirstName, @LastName, @UserName, @UserAge, @UserEmail, @UserPassword)

    SELECT 'Sign up successful. Please verify your email' AS Result;
    
END;

SELECT * FROM Users

DROP PROCEDURE AddUser

EXEC AddUser 'Melvin', 'Mulembo', 'TrippleX', 29, 'melvin.mulembo@gmail.com', 'katululumysa*fc234'

--Edit username
CREATE PROCEDURE EditUsername
	@userID uniqueidentifier,
	@newUserName VARCHAR(255)
AS 
BEGIN
	BEGIN TRANSACTION;

	BEGIN TRY
		IF EXISTS(SELECT 1 FROM Users WHERE UserName = @newUserName)
		BEGIN
			RAISERROR('New username already exists!', 16, 1);
			ROLLBACK;
			RETURN;
		END

		UPDATE Users
		SET UserName = @newUserName
		WHERE UserID = @userID;

		UPDATE Profile
		SET UserName = @newUserName
		WHERE UserID = @userID;

		COMMIT;
		SELECT 'Username edited successfully!' as Result;
	END TRY
	BEGIN CATCH
		ROLLBACK;
		THROW;
	END CATCH;
END



DROP PROCEDURE EditUsername
EXEC EditUsername @userID='374F8AD0-746E-4973-B213-D7997790911C', @newUserName='simpO';

SELECT * FROM Users

--delete account
CREATE PROCEDURE DeleteAccount
	@userID uniqueidentifier
AS
BEGIN
	DECLARE @username VARCHAR(255);

	SELECT @username = UserName
	FROM Users
	WHERE UserID = @userID;

	UPDATE Users
	SET AccountDeleted = 1
	WHERE UserID = @userID;

	SELECT CONCAT('@', @username, ', your account has been deleted.') AS Result;
END;

DROP PROCEDURE DeleteAccount

EXEC DeleteAccount @userID='EBD43751-9ED5-476F-9AFA-C3E603279E6F';



--Create profile
CREATE PROCEDURE CreateProfile
	@profileImage VARCHAR(255), 
	@userName VARCHAR(255), 
	@profileDescription VARCHAR(255)
AS
BEGIN
	DECLARE @userID uniqueidentifier

	SELECT @userID = UserID FROM Users WHERE UserName = @userName;

	IF @userID IS NULL
	BEGIN
		RAISERROR('User not found', 16, 1)
		RETURN;
	END

	IF EXISTS (SELECT 1 FROM Profile WHERE UserID = @userID)
	BEGIN
		RAISERROR('Profile already exists!', 16, 1)
		RETURN;
	END

	INSERT INTO Profile (UserID, ProfileImage, UserName, ProfileDescription)
	VALUES ((SELECT UserID FROM Users WHERE UserName = @userName), @profileImage, @userName, @profileDescription)

	SELECT 'Profile updated successfully' as Result
END

DROP PROCEDURE CreateProfile

EXEC CreateProfile @profileImage ='https://profiley/123', @userName = 'TrippleM', @profileDescription = 'It is not the waking, it is the rising'



--Create notification
CREATE PROCEDURE CreateNotification
    @receipientID uniqueidentifier,
    @notificationType VARCHAR(255)
AS
BEGIN
    INSERT INTO Notifications (ReceipientID, NotificationType)
    VALUES (@receipientID, @notificationType)
END

DROP PROCEDURE CreateNotification


--View all comments per post
CREATE PROCEDURE ViewComments
	@postID uniqueidentifier
AS
BEGIN
	SELECT * FROM Comments WHERE PostID = @postID
END

DROP PROCEDURE ViewComments
EXEC ViewComments @postID = '7DB7F931-6FCC-439C-8163-49A5FA90DCD6'




--Comment on a post
CREATE PROCEDURE CommentOnAPost
	@userID uniqueidentifier, 
	@postID uniqueidentifier, 
	@commentDescription VARCHAR(255)
AS
BEGIN
	INSERT INTO Comments (UserID, PostID, CommentDescription)
	VALUES(@userID, @postID, @commentDescription)

	DECLARE @reactingUserName VARCHAR(255)
	SELECT @reactingUserName = UserName FROM Users WHERE UserID = @userID

	DECLARE @originalPosterID uniqueidentifier;
	DECLARE @originalPosterName VARCHAR(255)
	SELECT @originalPosterID = UserID FROM Posts WHERE PostID = @postID;
	SELECT @originalPosterName = UserName FROM Users WHERE UserID = @userID;

	DECLARE @notificationMessage VARCHAR(255);
	SET @notificationMessage = '@' + @reactingUserName + ' commented on your post';

	EXEC CreateNotification @receipientID = @originalPosterID, @notificationType = @notificationMessage;
	
END

DROP PROCEDURE CommentOnAPost
EXEC CommentOnAPost @userID = '80960AD1-B34D-405C-874A-1A77B55B4282', @postID = 'D6A058EE-674E-4492-A629-2F7C710B693E', @commentDescription = 'Finese'

--Number of comments per post 

CREATE PROCEDURE CommentsCountPerPost
	@postId uniqueidentifier
AS
BEGIN
	DECLARE @commentCount INT
	SELECT @commentCount = dbo.CommentsCounterPerPost(@postID)

	SELECT @commentCount AS CommentCount
END;

EXEC CommentsCountPerPost @postId = 'D6A058EE-674E-4492-A629-2F7C710B693E'




--View all replies in a comment
CREATE PROCEDURE ViewReplies
	@commentID uniqueidentifier
AS
BEGIN
	SELECT * FROM Replies WHERE CommentID = @commentID
END

EXEC ViewReplies @commentID = '931833C0-5648-452F-992B-4834794E5AF4'


--Counting REPLIES
CREATE PROCEDURE ReplyCountPerComment
	@commentID uniqueidentifier
AS
BEGIN
	DECLARE @replyCount INT
	SELECT @replyCount = dbo.ReplyCounterPerComment(@commentID)

	SELECT @replyCount AS ReplyCount
END;

EXEC ReplyCountPerComment @commentID ='DE8F1CF7-8EFD-4C26-951A-53230736DE6E'


--Reply on a comment
CREATE PROCEDURE ReplyOnAComment
	@userID uniqueidentifier, 
	@commentID uniqueidentifier, 
	@replyDescription VARCHAR(255)
	
AS
BEGIN
	INSERT INTO Replies (UserID, CommentID, ReplyDescription)
	VALUES
	(@userID, @commentID, @replyDescription)

	DECLARE @reactingUserName VARCHAR(255)
	SELECT @reactingUserName = UserName FROM Users WHERE UserID = @userID

	DECLARE @originalPosterID uniqueidentifier;
	SELECT @originalPosterID = UserID FROM Comments WHERE CommentID = @commentID;

	DECLARE @notificationMessage VARCHAR(255);
	SET @notificationMessage = '@' + @reactingUserName + ' replied to your comment';

	EXEC CreateNotification @receipientID = @originalPosterID, @notificationType = @notificationMessage;
END

DROP PROCEDURE ReplyOnAComment

EXEC ReplyOnAComment @userID='7E9C4D03-041D-4DA8-8D2E-72D1D8B507A0', @commentID='1BF59C57-383B-4C41-90D3-0EDEEF398AE2', @replyDescription='Woah, lucky'



--View followers
CREATE PROCEDURE ViewFollowers
	@userID uniqueidentifier
AS
BEGIN
	SELECT u.UserID, u.UserName, p.ProfileDescription, p.ProfileImage
	FROM Users u
	INNER JOIN Profile p ON u.UserID = p.UserID
	INNER JOIN Followers f ON u.UserID = f.Follower
	WHERE f.followed = @userID
END

DROP PROCEDURE ViewFollowers

EXEC ViewFollowers @userID='7E9C4D03-041D-4DA8-8D2E-72D1D8B507A0'


-- Follow user feature
CREATE PROCEDURE FollowUser
    @followedID uniqueidentifier,
    @followerID uniqueidentifier
AS
BEGIN
    INSERT INTO Followers (Followed, Follower)
    VALUES (@followedID, @followerID)

    DECLARE @followerName VARCHAR(255)
    SELECT @followerName = UserName FROM Users WHERE UserID = @followerID

    DECLARE @followedName VARCHAR(255)
    SELECT @followedName = UserName FROM Users WHERE UserID = @followedID

    DECLARE @notificationMessage VARCHAR(255)
    SET @notificationMessage = '@' + @followerName + ' started following you'

    EXEC CreateNotification @receipientID = @followedID, @notificationType = @notificationMessage
END
 
DROP PROCEDURE FollowUser

EXEC FollowUser @followedID='7E9C4D03-041D-4DA8-8D2E-72D1D8B507A0', @followerID='30C16BE8-BC4B-4C1A-8B16-56C7BEFFC106'



-- Unfollow user feature
CREATE PROCEDURE UnfollowUser
    @followerID uniqueidentifier,
    @followedID uniqueidentifier
AS
BEGIN
    DELETE FROM Followers
    WHERE Followed = @followedID AND Follower = @followerID

    DECLARE @followerName VARCHAR(255)
    SELECT @followerName = UserName FROM Users WHERE UserID = @followerID

    DECLARE @notificationMessage VARCHAR(255)
    SET @notificationMessage = '@' + @followerName + ' unfollowed you'

    EXEC CreateNotification @receipientID = @followedID, @notificationType = @notificationMessage
END

DROP PROCEDURE UnfollowUser
EXEC UnfollowUser @followedID='7E9C4D03-041D-4DA8-8D2E-72D1D8B507A0', @followerID='30C16BE8-BC4B-4C1A-8B16-56C7BEFFC106'



--Number of followers per user
CREATE PROCEDURE FollowerCountPerUser
	@userID uniqueidentifier
AS
BEGIN
	SELECT COUNT(*) AS FollowerCount
	FROM Followers
	WHERE Followed = @userID
END


EXEC dbo.FollowerCountPerUser @userID='7E9C4D03-041D-4DA8-8D2E-72D1D8B507A0';



--React to a post/comment/reply and notify the poster
CREATE PROCEDURE ReactToPostCommentReply
	@userID uniqueidentifier, 
	@category VARCHAR(255), 
	@reactionType VARCHAR(255), 
	@categoryID uniqueidentifier
AS
BEGIN
	INSERT INTO Reactions (UserID, Category, ReactionType, CategoryID)
	VALUES (@userID, @category, @reactionType, @categoryID)

	DECLARE @originalPosterID uniqueidentifier;
	IF @category = 'Post'
	BEGIN
		SELECT @originalPosterID = UserID FROM Posts WHERE PostID = @categoryID;
	END
	ELSE IF @category = 'Comment'
	BEGIN
		SELECT @originalPosterID = UserID FROM Comments WHERE CommentID = @categoryID;
	END
	ELSE IF @category = 'Reply'
	BEGIN
		SELECT @originalPosterID = UserID FROM Replies WHERE ReplyID = @categoryID;
	END

	DECLARE @reactingUserName VARCHAR(255)
	SELECT @reactingUserName = UserName FROM Users WHERE UserID = @userID

	DECLARE @notificationMessage VARCHAR(255);
	SET @notificationMessage = CONCAT('@' + @reactingUserName + ' '+ LOWER(@reactionType) +'s your ', LOWER(@category), '.');

	EXEC CreateNotification @receipientID = @originalPosterID, @notificationType = @notificationMessage;
END


DROP PROCEDURE ReactToPostCommentReply
EXEC ReactToPostCommentReply @userID='EBD43751-9ED5-476F-9AFA-C3E603279E6F', @category='Post', @reactionType= 'Like', @categoryID='D6A058EE-674E-4492-A629-2F7C710B693E'




---Delete reaction
CREATE PROCEDURE DeleteReaction
	@userID uniqueidentifier, 
	@category VARCHAR(255), 
	@reactionType VARCHAR(255), 
	@categoryID uniqueidentifier
AS
BEGIN
	DELETE FROM Reactions WHERE UserID = @userID AND Category = @category AND ReactionType = @reactionType AND CategoryID = @categoryID;

	DECLARE @originalPosterID uniqueidentifier;
	IF @category = 'Post'
	BEGIN
		SELECT @originalPosterID = UserID FROM Posts WHERE PostID = @categoryID;
	END
	ELSE IF @category = 'Comment'
	BEGIN
		SELECT @originalPosterID = UserID FROM Comments WHERE CommentID = @categoryID;
	END
	ELSE IF @category = 'Reply'
	BEGIN
		SELECT @originalPosterID = UserID FROM Replies WHERE ReplyID = @categoryID;
	END

	DECLARE @reactingUserName VARCHAR(255)
	SELECT @reactingUserName = UserName FROM Users WHERE UserID = @userID

	DECLARE @notificationMessage VARCHAR(255);
	SET @notificationMessage = CONCAT('@' + @reactingUserName + ' un'+ LOWER(@reactionType) +'d your ', LOWER(@category), '.');

	EXEC CreateNotification @receipientID = @originalPosterID, @notificationType = @notificationMessage;
END

DROP PROCEDURE DeleteReaction

EXEC DeleteReaction @userID='FCB0A209-3C1A-4D12-9571-1E19BF3120A3', @category='Comment', @reactionType= 'Like', @categoryID='BF2160BF-C5BC-4556-83F6-3F8DEFCE059A'




--View user activity
CREATE PROCEDURE ViewUserActivity
	@userID uniqueidentifier
AS
BEGIN
	SELECT 'Post' AS ItemType, PostID AS ItemID, PostDescription AS ItemContent, timestamp AS ItemDate
	FROM Posts
	WHERE UserID = @userID

	UNION --we are combining the result of out select statements

	SELECT 'Comment' AS ItemType, CommentID AS ItemID, CommentDescription AS ItemContent, timestamp AS ItemDate
	FROM Comments
	WHERE UserID = @userID

	UNION
	
	SELECT 'Reply' AS ItemType, ReplyID AS ItemID, ReplyDescription AS ItemContent, timestamp AS ItemDate
	FROM Replies
	WHERE UserID = @userID

	ORDER BY ItemDate DESC;
END


EXEC ViewUserActivity @userID='FCB0A209-3C1A-4D12-9571-1E19BF3120A3'



--Create new post

CREATE PROCEDURE CreateNewPost
	@userID uniqueidentifier, 
	@postURL VARCHAR(255), 
	@postDescription VARCHAR(255)
AS
BEGIN
	INSERT INTO Posts (UserID, PostURL, PostDescription)
	VALUES (@userID, @postURL, @postDescription)

	DECLARE @postingUserName VARCHAR(255)
	SELECT @postingUserName = UserName FROM Users WHERE UserID = @userID

	DECLARE @followerIDs TABLE (Follower uniqueidentifier)
	INSERT INTO @followerIDs (Follower)
	SELECT Follower FROM Followers WHERE Followed = @userID
	
	DECLARE @receipientID uniqueidentifier
	DECLARE follower_cursor CURSOR FOR
	SELECT Follower FROM @followerIDs

	OPEN follower_cursor
	FETCH NEXT FROM follower_cursor INTO @receipientID

	WHILE @@FETCH_STATUS = 0
	BEGIN
		DECLARE @notificationMessage VARCHAR(255)
		SET @notificationMessage = '@' + @postingUserName + ' created a new post'

		INSERT INTO Notifications (ReceipientID, NotificationType)
		VALUES (@receipientID, @notificationMessage)

		FETCH NEXT FROM follower_cursor INTO @receipientID
	END

	CLOSE follower_cursor
	DEALLOCATE follower_cursor
END

DROP PROCEDURE CreateNewPost

EXEC ViewFollowers @userID = 'FCB0A209-3C1A-4D12-9571-1E19BF3120A3'

EXEC CreateNewPost @userID='FCB0A209-3C1A-4D12-9571-1E19BF3120A3', @postURL='https://posty.com/3', @PostDescription='Getting lost at Bermuda Triangle'


--Searching stored procedure (Search by username)

CREATE PROCEDURE SearchUsersByUsername
    @username VARCHAR(MAX)
AS
BEGIN
    SELECT u.UserID, u.UserName, p.ProfileDescription, p.ProfileImage
    FROM Users u
    LEFT JOIN Profile p ON u.UserID = p.UserID
    WHERE u.UserName COLLATE SQL_Latin1_General_CP1_CI_AI LIKE '%' + @username + '%'
END


SELECT * FROM Users


EXEC SearchUsersByUsername @username = 'sl'

--Editing profile stored procedure
CREATE PROCEDURE EditUserProfile
    @userID uniqueidentifier,
    @newUsername VARCHAR(255),
    @profileImage VARCHAR(255),
    @profileDescription VARCHAR(500)
AS
BEGIN
    UPDATE Profile
    SET UserName = @newUsername,
        ProfileImage = @profileImage,
        ProfileDescription = @profileDescription
    WHERE UserID = @userID;
	SELECT * FROM Profile
END


EXEC EditUserProfile @userID = 'FCB0A209-3C1A-4D12-9571-1E19BF3120A3', @newUsername = 'blessed', @profileImage = 'https://imagey/4567', @profileDescription = 'Programmer night and day'

