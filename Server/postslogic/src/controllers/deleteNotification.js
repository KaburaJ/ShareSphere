const mssql = require('mssql');
const config = require('../config/userConfig');

async function DeleteNotification(req, res) {
  try{
        let sql = await mssql.connect(config);
        let UserID = req.session.user.UserID;
        let notificationID = req.body.notificationID
        if (sql.connected) {
            const request = new mssql.Request(sql);
            request.input('userID', UserID)
            request.input('notificationID', notificationID)
            const results = await request.execute('dbo.DeleteNotification');
            res.json(results.recordset);
        }
  }
   catch (error) {
      console.error('Error deleting notification:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

module.exports = DeleteNotification
