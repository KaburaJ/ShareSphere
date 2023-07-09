const bcrypt = require('bcrypt');
const config = require('../config/userConfig');
const mssql = require('mssql');
const loginSchema = require('../validators/userLoginValidators');

require('dotenv').config();

module.exports = {
  loginUser: async (req, res) => {
    try {
      const { error, value } = loginSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const user = value;
      const sql = await mssql.connect(config);
      if (sql.connected) {
        const request = new mssql.Request(sql);
        request.input('UserName', user.UserName);
        const result = await request.query('SELECT * FROM Users WHERE UserName = @UserName');

        if (result.recordset.length) {
          const dbPassword = result.recordset[0].UserPassword;
          const passwordsMatch = await bcrypt.compare(user.UserPassword, dbPassword);
          if (passwordsMatch) {
            req.session.user = result.recordset[0];
            console.log(req.session.user);
            req.session.userId = user.id;
            req.session.save((error) => {
              if (error) {
                console.error('Session save error:', error);
              } else {
                res.status(200).json({
                  success: true,
                  message: 'Logged in successfully',
                  result: user.id,
                });
              }
            });
          } else {
            res.status(401).json({
              success: false,
              message: 'Incorrect password',
            });
          }
        } else {
          res.status(404).json({ success: false, message: 'No user found' });
        }
      } else {
        res.status(500).json({ success: false, message: 'Database connection error' });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Login error',
      });
    }
  },
};
