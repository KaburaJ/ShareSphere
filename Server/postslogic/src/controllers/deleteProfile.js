const mssql = require('mssql');
const config = require('../config/userConfig');

async function DeleteProfile(req, res) {
  try{
        let sql = await mssql.connect(config);
        let UserID = req.session.user.UserID;
        let notificationID = req.body.notificationID
        if (sql.connected) {
            const request = new mssql.Request(sql);
            request.input('userID', UserID)
            const results = await request.execute('dbo.DeleteProfile');
            res.json({
                success: true,
                message: 'Profile deleted successfully',
                results: results.recordset
            });
        }
  }
   catch (error) {
      console.error('Error deleting profile:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

module.exports = DeleteProfile
