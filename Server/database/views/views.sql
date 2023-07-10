--Seeing posts' descriptions, comments and replies at once
CREATE PROCEDURE GetPostDetails
  @postId uniqueidentifier
AS
BEGIN
  SELECT
    p.PostID,
    p.PostDescription,
	c.CommentID,
    c.CommentDescription,
    r.ReplyID,
    r.ReplyDescription,
    re.Category,
	re.ReactionID,
    re.ReactionType
  FROM
    Posts p
  LEFT JOIN
    Comments c ON p.PostID = c.PostID
  LEFT JOIN
    Replies r ON c.CommentID = r.CommentID
  LEFT JOIN
    Reactions re ON (re.Category = 'Post' AND re.CategoryID = p.PostID)
     OR (re.Category = 'Comment' AND re.CategoryID = c.CommentID)
     OR (re.Category = 'Reply' AND re.CategoryID = r.ReplyID)
  WHERE
    p.PostID = @postId;
END;
