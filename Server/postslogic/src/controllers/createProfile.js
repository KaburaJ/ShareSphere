const mssql = require('mssql');
const config = require('../config/userConfig');

async function CreateProfile(req, res) {
  try{
        let sql = await mssql.connect(config);
        let user = req.body;
        //check user login
        if (sql.connected) {
            const request = new mssql.Request(sql);
            request.input('profileImage',user.ProfileImage)
            .input('userName',user.UserName)
            .input('profileDescription',user.ProfileDescription)
            const results = await request.execute('dbo.CreateProfile');
            res.json(results.recordset);
        }
  }
   catch (error) {
      console.error('Error retrieving users:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

module.exports = CreateProfile
