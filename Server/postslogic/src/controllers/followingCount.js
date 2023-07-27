const mssql = require('mssql');
const config = require('../config/userConfig');

async function FollowingCountPerUser(req, res) {
  try{
        let sql = await mssql.connect(config);
        console.log(req.params.userid);
        let UserID;
        if(req.params.userid){
          UserID = req.params.userid
          
        }else{
          UserID = req.session.user.UserID
        }
        if (sql.connected) {
          let request = new mssql.Request(sql);
          request.input('userID',mssql.UniqueIdentifier, UserID)
          let results = await request.execute('FollowingCountPerUser')
          res.json({
            success: true,
            message: "Followers counted successfully",
            results: results.recordset
          }
           );
        }
  }
   catch (error) {
      console.error('Error counting followers:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

module.exports = FollowingCountPerUser
