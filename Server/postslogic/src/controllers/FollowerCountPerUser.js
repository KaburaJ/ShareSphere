const mssql = require('mssql');
const config = require('../config/userConfig');

async function FollowerCountPerUser(req, res) {
  try{
        let sql = await mssql.connect(config);
        let UserID = req.params.id;
        if (sql.connected) {
          let request = new mssql.Request(sql);
          request.input('userID', UserID)
          let results = await request.execute('FollowerCountPerUser')
          res.json({
            success: true,
            message: "Followers counted successfully",
            results: results.recordsets
          }
           );
        }
  }
   catch (error) {
      console.error('Error counting followers:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

module.exports = FollowerCountPerUser
