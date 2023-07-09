const mssql = require('mssql');
const config = require('../config/userConfig');

async function getAllUsers(req, res) {
  try{
        let sql = await mssql.connect(config);
        if (sql.connected) {
          let results = await sql.query('SELECT * FROM dbo.Users');
          res.json(results.recordset);
        }
  }
   catch (error) {
      console.error('Error retrieving users:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

module.exports = getAllUsers
