const mssql = require('mssql');
const config = require('../config/userConfig');


async function getAllPosts(req, res) {
  try {
    const sql = await mssql.connect(config);
    if (sql.connected) {
      const result = await sql.query('SELECT * FROM Posts ORDER BY timestamp DESC');
      res.json(result.recordset);
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = getAllPosts;
