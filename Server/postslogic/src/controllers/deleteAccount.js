const mssql = require('mssql');
const config = require('../config/userConfig');

async function DeleteAccount(req, res) {
  try{
        let sql = await mssql.connect(config);
        let UserID = req.session.user.UserID;
        if (sql.connected) {
            const request = new mssql.Request(sql);
            request.input('userID', UserID)
            const results = await request.execute('dbo.DeleteAccount');
            res.json(results.recordset);
        }
  }
   catch (error) {
      console.error('Error deleting account:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

module.exports = DeleteAccount
