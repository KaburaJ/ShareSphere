const mssql = require('mssql');
const config = require('../config/userConfig');

async function UnfollowUser(req, res) {
  try{
        let sql = await mssql.connect(config);
        let UserID = req.session.user.UserID;
        let user = req.body;
        if (sql.connected) {
          let request = new mssql.Request(sql);
          request.input('followedID', UserID)
          request.input('followerID', user.FollowedID)
          let results = await request.execute('UnfollowUser')
          res.json({
            success: true,
            message: "Unfollowing done successfully",
            results: results.recordset
          }
           );
        }
  }
   catch (error) {
      console.error('Error unfollowing user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

module.exports = UnfollowUser
