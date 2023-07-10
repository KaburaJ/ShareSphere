const mssql = require('mssql');
const config = require('../config/userConfig');

async function DeletePostWithCommentsAndReactions(req, res) {
  try{
        let sql = await mssql.connect(config);
        let user= req.body;
        if (sql.connected) {
          let request = new mssql.Request(sql);
          request.input('postId', user.PostID)

          let results = await request.execute('DeletePostWithCommentsAndReactions')
          res.json({
            success: true,
            message: "Post deleted successfully",
            results: results.recordset
          }
           );
        }
  }
   catch (error) {
      console.error('Error deleting post:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

module.exports = DeletePostWithCommentsAndReactions
