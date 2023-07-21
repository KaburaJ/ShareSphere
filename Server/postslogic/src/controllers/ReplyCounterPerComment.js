const mssql = require('mssql');
const config = require('../config/userConfig');

async function ReplyCounterPerComment(req, res) {
  try{
        let sql = await mssql.connect(config);
        let CommentID = req.params.id;
        if (sql.connected) {
          let request = new mssql.Request(sql);
          request.input('commentID', CommentID)
          let results = await request.execute('ReplyCountPerComment')
          res.json({
            success: true,
            message: "Replies counted successfully",
            results: results.recordset
          }
           );
        }
  }
   catch (error) {
      console.error('Error counting replies:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

module.exports = ReplyCounterPerComment
