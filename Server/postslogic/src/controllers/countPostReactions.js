const mssql = require('mssql');
const config = require('../config/userConfig');

async function CountReactionsPerPost(req, res) {
  try{
        let sql = await mssql.connect(config);
        let postID = req.body.postID;
        if (sql.connected) {
          let request = new mssql.Request(sql);
          request.input('postID', postID)
          let results = await request.execute('CountReactionsPerPost')
          res.json({
            success: true,
            message: "Post reactions counted successfully",
            results: results
          }
           );
        }
  }
   catch (error) {
      console.error('Error counting reactions:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

module.exports = CountReactionsPerPost
