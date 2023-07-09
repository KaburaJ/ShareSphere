const mssql = require('mssql');
const config = require('../config/userConfig');

async function CreateNewPost(req, res) {
  try{
        let sql = await mssql.connect(config);
        let user = req.body;
        if (sql.connected) {
            const request = new mssql.Request(sql);
            request.input('userID',user.UserID)
            .input('postURL',user.PostURL)
            .input('postDescription',user.PostDescription)
            const results = await request.execute('dbo.CreateNewPost');
            res.json({
                success: true,
                message: "Post updated successfully"
            });
        }
  }
   catch (error) {
      console.error('Error creating new post:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

module.exports = CreateNewPost
