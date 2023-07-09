const mssql = require('mssql');
const config = require('../config/userConfig');

async function SearchUsersByUsername(req, res) {
  try{
        let sql = await mssql.connect(config);
        let users = req.body;
        if (sql.connected) {
          let request = new mssql.Request(sql);
          request.input('username', users.UserName)
          let results = await request.execute('SearchUsersByUsername')
          res.json({
            success: true,
            message: "Search done successfully",
            results: results.recordset
          }
           );
        }
  }
   catch (error) {
      console.error('Error while searching:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

module.exports = SearchUsersByUsername
