const mssql = require('mssql');
const config = require('../config/userConfig');

async function SpecificUserDetails(req, res) {
  let UserID = req.session.user.UserID;
  try {
    let sql = await mssql.connect(config);
    if (sql.connected) {
      const request = new mssql.Request(sql);
      request.input('UserID', mssql.UniqueIdentifier, UserID);
      const results = await request.query(`SELECT * FROM Users WHERE UserID = @UserID`)
      res.json(results.recordset);
    }
  } catch (error) {
    console.error('Error retrieving user details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = SpecificUserDetails;
