const mssql = require('mssql');
const config = require('../config/userConfig');

async function FollowUser(req, res) {
  try {
    let sql = await mssql.connect(config);
    let user = req.body;
    let followerID = req.session.user.UserID; // Get the logged-in user's ID from the session

    if (sql.connected) {
      let request = new mssql.Request(sql);
      request.input('followerID', followerID) // Set the followerID
             .input('followedID', user.FollowedID);
      
      let results = await request.execute('FollowUser');
      res.json({
        success: true,
        message: "Following done successfully",
        results: results.recordset
      });
    }
  } catch (error) {
    console.error('Error following user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = FollowUser;
