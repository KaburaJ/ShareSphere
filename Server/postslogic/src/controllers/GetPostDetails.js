const mssql = require('mssql');
const config = require('../config/userConfig');

async function GetPostDetails(req, res) {
  try {
    let sql = await mssql.connect(config);
    let user = req.body;
    if (sql.connected) {
      let request = new mssql.Request(sql);
      request.input('postId', user.PostID);
      let results = await request.execute('GetPostDetails');
      let posts = {};
      results.recordset.forEach((row) => {
        let postId = row.PostID;

        if (!posts[postId]) {
          posts[postId] = {
            PostID: row.PostID,
            UserID: row.UserID,
            UserName: row.UserName,
            ProfileImage: row.ProfileImage, // Include the ProfileImage
            PostURL: row.PostURL,
            PostDescription: row.PostDescription,
            Comments: [],
            Reactions: {},
          };
        }

        if (row.CommentID) {
          let commentId = row.CommentID;
          let comment = posts[postId].Comments.find((comment) => comment.CommentID === commentId);

          if (!comment) {
            comment = {
              CommentID: commentId,
              UserID: row.CommentUserID,
              UserName: row.CommentUserName,
              ProfileImage: row.CommenterProfileImage, // Include the commenter profile image
              CommentDescription: row.CommentDescription,
              Replies: [],
              Reactions: {},
              LikeCount: row.CommentCount, // Include the comment like count
            };
            posts[postId].Comments.push(comment);
          }

          if (row.ReplyID) {
            let replyId = row.ReplyID;
            let reply = comment.Replies.find((reply) => reply.ReplyID === replyId);

            if (!reply) {
              reply = {
                ReplyID: replyId,
                UserID: row.ReplyUserID,
                UserName: row.ReplyUserName,
                ProfileImage: row.ReplierProfileImage, // Include the replier profile image
                ReplyDescription: row.ReplyDescription,
                Reactions: {},
                LikeCount: row.ReplyCount, // Include the reply like count
              };
              comment.Replies.push(reply);
            }

            if (row.ReactionID) {
              let category = row.Category;
              let reactionId = row.ReactionID;

              if (!reply.Reactions[category]) {
                reply.Reactions[category] = [];
              }

              reply.Reactions[category].push({
                ReactionID: reactionId,
                ReactionType: row.ReactionType,
              });
            }
          }

          if (row.ReactionID && row.Category === 'Comment') {
            let category = row.Category;
            let reactionId = row.ReactionID;

            if (!comment.Reactions[category]) {
              comment.Reactions[category] = [];
            }

            comment.Reactions[category].push({
              ReactionID: reactionId,
              ReactionType: row.ReactionType,
            });
          }
        }

        if (row.ReactionID && row.Category === 'Post') {
          let category = row.Category;
          let reactionId = row.ReactionID;

          if (!posts[postId].Reactions[category]) {
            posts[postId].Reactions[category] = [];
          }
          posts[postId].Reactions[category].push({
            ReactionID: reactionId,
            ReactionType: row.ReactionType,
          });
        }
      });

      const postArray = Object.values(posts);
      res.json({
        success: true,
        results: postArray,
      });
    }
  } catch (error) {
    console.error('Error viewing post details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = GetPostDetails;
