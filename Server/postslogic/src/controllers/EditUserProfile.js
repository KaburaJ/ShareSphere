const mssql = require('mssql');
const config = require('../config/userConfig');

async function EditUserProfile(req, res) {
  try{
        let sql = await mssql.connect(config);
        let user = req.body;
        let UserID = req.session.user.UserID;
        if (sql.connected) {
            const request = new mssql.Request(sql);
            request.input('userID',UserID)
            .input('newUserName',user.UserName)
            .input('profileImage',user.ProfileImage)
            .input('profileDescription',user.ProfileDescription)
            const results = await request.execute('dbo.EditUserProfile');
            res.json({
                success: true,
                message: "Profile edited successfully"
            });
        }
  }
   catch (error) {
      console.error('Error while editing user profile:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

module.exports = EditUserProfile
