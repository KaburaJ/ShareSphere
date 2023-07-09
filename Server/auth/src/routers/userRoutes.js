const express = require('express');
const userRoutes = express.Router();
const { postUser } = require('../controllers/UserRegistrationController');
const  { loginUser } = require('../controllers/UserLoginController');
const { logoutUser } = require('../controllers/UserLogoutController');


userRoutes.post('/users/signin', postUser);
userRoutes.post('/users/login', loginUser);
userRoutes.post('/users/logout', logoutUser)

module.exports = userRoutes;
