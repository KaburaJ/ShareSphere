const mssql = require('mssql');
const config = require('../config/userConfig');


async function GetFollowedUsersPosts(req, res) {
  try {

    const sql = await mssql.connect(config);
    let UserID = req.session.user.UserID;
    if (sql.connected) {
      const request = new mssql.Request(sql);
      request.input('userId', mssql.UniqueIdentifier, UserID);
      const results = await request.execute('GetFollowedUsersPosts');
      res.json(results);
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = GetFollowedUsersPosts;
