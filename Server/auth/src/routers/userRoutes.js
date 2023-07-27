const express = require('express');
const userRoutes = express.Router();
const { postUser } = require('../controllers/UserRegistrationController');
const { logoutUser } = require('../controllers/UserLogoutController');
const { loginUser } = require('../controllers/UserLoginController');


userRoutes.post('/users/signin', postUser);
userRoutes.post('/users/login', loginUser);
userRoutes.post('/users/logout', logoutUser)

module.exports = userRoutes;
