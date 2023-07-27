const mssql = require('mssql');
const config = require('../config/userConfig');

async function getAllPeople(req, res) {
    let userid = req.session.user.UserID
  try {
    let sql = await mssql.connect(config);
    if (sql.connected) {
      const request = new mssql.Request(sql);
      const results = await request.query(`SELECT * FROM Users WHERE UserID <> @userid`)
      res.json(results.recordset);
    }
  } catch (error) {
    console.error('Error retrieving users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = getAllPeople;
