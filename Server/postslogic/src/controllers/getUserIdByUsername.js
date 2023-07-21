const mssql = require('mssql');
const config = require('../config/userConfig');


async function GetUserNameById(req, res) {
    try {
      let sql = await mssql.connect(config);
      let { UserName } = req.body; // Extracting UserName from req.body
      if (sql.connected) {
        const request = new mssql.Request(sql);
        request.input('UserName', UserName);
        const results = await request.query('SELECT UserID FROM Users WHERE UserName = @UserName');
        res.json({
          success: true,
          message: "User ID obtained successfully",
          results: results,
        });
      }
    } catch (error) {
      console.error('Error creating new post:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  module.exports = GetUserNameById;
  