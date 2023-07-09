--Number of comments per post 

CREATE FUNCTION CommentsCounterPerPost
	(@postId uniqueidentifier)
RETURNS INT
AS 
BEGIN
	DECLARE @commentCount INT

	SELECT @commentCount  = COUNT(*) 
	FROM Comments
	WHERE PostID = @postId;

	RETURN @commentCount
END

--Counting REPLIES
CREATE FUNCTION ReplyCounterPerComment
	(@commentID uniqueidentifier)
RETURNS INT
AS 
BEGIN
	DECLARE @replyCount INT

	SELECT @replyCount  = COUNT(*) 
	FROM Replies
	WHERE CommentID = @commentId;

	RETURN @replyCount
END