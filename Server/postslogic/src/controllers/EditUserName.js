const mssql = require('mssql');
const config = require('../config/userConfig');

async function EditUsername(req, res) {
  try{
        let sql = await mssql.connect(config);
        let user = req.body;
        let UserID = req.session.user.UserID;
        if (sql.connected) {
            const request = new mssql.Request(sql);
            request.input('userID',UserID)
            .input('newUserName',user.UserName)
            const results = await request.execute('dbo.EditUsername');
            res.json(results.recordset);
        }
  }
   catch (error) {
      console.error('Error retrieving users:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

module.exports = EditUsername
