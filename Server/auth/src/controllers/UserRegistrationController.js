const userSchema = require('../validators/userRegistrationvalidators');
const config = require('../config/userConfig');
const mssql = require('mssql');
const bcrypt = require('bcrypt');
const sendMail = require('../utils/sendMail');
const ejs = require('ejs');
const path = require('path');
require('dotenv').config();

module.exports = {
  postUser: async (req, res) => {
    try {
      const { error, value } = userSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const user = req.body;
     
      const hashedPwd = await bcrypt.hash(user.UserPassword, 8);

      const sql = await mssql.connect(config);

      if (sql.connected) {
        const request = new mssql.Request(sql);
        request.input('FirstName', user.FirstName)
          .input('LastName', user.LastName)
          .input('UserName', user.UserName)
          .input('UserAge', user.UserAge)
          .input('UserEmail', user.UserEmail)
          .input('UserPassword', hashedPwd);

        const results = await request.execute('dbo.AddUser');
        res.json(results.recordset);

        const emailBody = await ejs.renderFile(path.join(__dirname, '../views/email.ejs'), { userName: user.UserName });
        sendMail(user.UserEmail, 'Verification Email', emailBody);
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred while adding the user.');
    }
  }
};
