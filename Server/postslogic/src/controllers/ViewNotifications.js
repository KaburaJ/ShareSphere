const mssql = require('mssql');
const config = require('../config/userConfig');

async function ViewNotifications(req, res) {
  try{
        let sql = await mssql.connect(config);
        let UserID = req.session.user.UserID;
        if (sql.connected) {
          let request = new mssql.Request(sql);
          request.input('userID', UserID)
          let results = await request.execute('ViewNotifications')
          res.json({
            success: true,
            results: results.recordset
          }
            );
        }
  }
   catch (error) {
      console.error('Error viewing notifications:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

module.exports = ViewNotifications
