const mssql = require('mssql');
const config = require('../config/userConfig');


async function ViewOtherUserProfile(req, res) {
    try {
      let sql = await mssql.connect(config);
      let username = req.params.username;
      if (sql.connected) {
        const request = new mssql.Request(sql);
        request.input('UserName', username)
        let results = await request.execute('usp_GetOtherUserProfile');
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
  
  module.exports = ViewOtherUserProfile;
  