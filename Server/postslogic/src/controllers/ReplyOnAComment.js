const mssql = require('mssql');
const config = require('../config/userConfig');

async function ReplyOnAComment(req, res) {
  try{
        let sql = await mssql.connect(config);
        let user = req.body;
        let UserID = req.session.user.UserID;
        if (sql.connected) {
          let request = new mssql.Request(sql);
          request.input('userID', UserID)
          request.input('commentID', user.CommentID)
          request.input('replyDescription', user.ReplyDescription)
          let results = await request.execute('ReplyOnAComment')
          res.json({
            success: true,
            message: "Replied successfully",
            results: results.recordset
          }
           );
        }
  }
   catch (error) {
      console.error('Error viewing comments:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

module.exports = ReplyOnAComment
