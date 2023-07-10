const mssql = require('mssql');
const config = require('../config/userConfig');

async function ViewComments(req, res) {
  try{
        let sql = await mssql.connect(config);
        let user = req.body;
        if (sql.connected) {
          let request = new mssql.Request(sql);
          request.input('postID', user.PostID)
          let results = await request.execute('ViewComments')
          res.json({
            success: true,
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

module.exports = ViewComments
