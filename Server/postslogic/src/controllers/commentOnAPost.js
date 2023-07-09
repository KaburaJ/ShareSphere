const mssql = require('mssql');
const config = require('../config/userConfig');
const { message } = require('../../../auth/src/validators/userRegistrationvalidators');

async function CommentOnAPost(req, res) {
  try{
        let sql = await mssql.connect(config);
        let user = req.body;
        if (sql.connected) {
          let request = new mssql.Request(sql);
          request.input('userID', user.UserID)
          request.input('postID', user.PostID)
          request.input('commentDescription', user.CommentDescription)
          let results = await request.execute('CommentOnAPost')
          res.json({
            success: true,
            message: "Commented successfully",
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

module.exports = CommentOnAPost
