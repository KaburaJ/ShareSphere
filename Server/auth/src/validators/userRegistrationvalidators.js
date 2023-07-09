const Joi = require('joi');

const userSchema = Joi.object({
    FirstName: Joi.string().required(),
    LastName: Joi.string().required(),
    UserName: Joi.string().required(),
    UserAge: Joi.number().required(),
    UserEmail: Joi.string().required(),
    UserPassword: Joi.string().pattern(new RegExp("^[A-Za-z0-9]")).required(),
    c_password: Joi.ref("UserPassword"),
  
  }).with("Password", "c_password");

module.exports = userSchema;