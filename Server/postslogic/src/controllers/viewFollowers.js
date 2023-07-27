const mssql = require('mssql');
const config = require('../config/userConfig');

async function ViewFollowers(req, res) {
  try{
        let sql = await mssql.connect(config);
        let UserID=req.session.user.UserID;
        if (sql.connected) {
          let request = new mssql.Request(sql);
          request.input('UserID', UserID)
          let results = await request.execute('ViewFollowers')
          res.json(
            {
              success: true,
              results: results.recordset
            });
        }
  }
   catch (error) {
      console.error('Error viewing followers:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

module.exports = ViewFollowers
