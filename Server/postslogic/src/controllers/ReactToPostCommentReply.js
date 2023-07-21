const mssql = require('mssql');
const config = require('../config/userConfig');

async function ReactToPostCommentReply(req, res) {
  try{
        let sql = await mssql.connect(config);
        let user = req.body;
        let UserID = req.session.user.UserID;
        if (sql.connected) {
          let request = new mssql.Request(sql);
          request.input('userID', UserID)
          .input('category', user.Category)
          .input('reactionType', user.ReactionType)
          .input('categoryID', user.CategoryID)

          let results = await request.execute('ReactToPostCommentReply')
          res.json({
            success: true,
            message: "Reacted successfully",
            results: results.recordset
          }
           );
        }
  }
   catch (error) {
      console.error('Error reacting:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

module.exports = ReactToPostCommentReply
