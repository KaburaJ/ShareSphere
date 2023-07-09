const mssql = require('mssql');
const config = require('../config/userConfig');
const { message } = require('../../../auth/src/validators/userRegistrationvalidators');

async function ViewReplies(req, res) {
  try{
        let sql = await mssql.connect(config);
        let CommentID = req.params.id;
        if (sql.connected) {
          let request = new mssql.Request(sql);
          request.input('commentID', CommentID)
          let results = await request.execute('ViewReplies')
          res.json({
            success: true,
            message: "Viewed replies successfully",
            results: results.recordset
          }
           );
        }
  }
   catch (error) {
      console.error('Error viewing replies:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

module.exports = ViewReplies
