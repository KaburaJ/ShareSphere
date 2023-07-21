const mssql = require('mssql');
const config = require('../config/userConfig');


async function GetProfile(req, res) {
    try {
      let sql = await mssql.connect(config);
      let UserID = req.session.user.UserID;
      if (sql.connected) {
        const request = new mssql.Request(sql);
        request.input('userID', UserID);
        const results = await request.execute('GetProfile');
        res.json({
          success: true,
          message: "Profile obtained successfully",
          results: results,
        });
      }
    } catch (error) {
      console.error('Error viewing profile:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  module.exports = GetProfile;
  