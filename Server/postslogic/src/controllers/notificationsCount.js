const mssql = require('mssql');
const config = require('../config/userConfig');

async function NotificationsCount(req, res) {
  try{
        let sql = await mssql.connect(config);
        let UserID= req.session.user.UserID;
        
        if (sql.connected) {
          let request = new mssql.Request(sql);
          request.input('userID',mssql.UniqueIdentifier, UserID)
          let results = await request.execute('NotificationsCount')
          res.json({
            success: true,
            message: "Notifications counted successfully",
            results: results.recordset
          }
           );
        }
  }
   catch (error) {
      console.error('Error counting notifications:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

module.exports = NotificationsCount
