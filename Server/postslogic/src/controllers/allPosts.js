const  pool = require("../../server");


async function getAllPosts(req, res) {
  try {
    const sql = await pool;
    const result = await sql.query('SELECT * FROM Posts');

    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = getAllPosts;
