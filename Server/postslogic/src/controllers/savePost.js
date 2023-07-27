const mssql = require('mssql');
const config = require('../config/userConfig');

async function SavePost(req, res) {
  try{
        let sql = await mssql.connect(config);
        let user = req.body;
        let UserID = req.session.user.UserID;
        if (sql.connected) {
          let request = new mssql.Request(sql);
          request.input('UserID', UserID)
          .input('PostID', user.PostID)

          let results = await request.execute('SavePost')
          res.json({
            success: true,
            message: "Saved successfully",
            results: results.recordset
          }
           );
        }
  }
   catch (error) {
      console.error('Error saving:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

module.exports = SavePost
