const mssql = require('mssql');
const config = require('../config/userConfig');
const { message } = require('../../../auth/src/validators/userRegistrationvalidators');

async function CommentsCounterPerPost(req, res) {
  try{
        let sql = await mssql.connect(config);
        let PostID = req.params.id;
        if (sql.connected) {
          let request = new mssql.Request(sql);
          request.input('postId', PostID)
          let results = await request.execute('CommentsCountPerPost')
          res.json({
            success: true,
            message: "Comment counted successfully",
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

module.exports = CommentsCounterPerPost
