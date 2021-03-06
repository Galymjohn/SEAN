'use strict';

require('dotenv').config();
var express = require('express');
var parser = require('body-parser');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var middlewareRoute = express.Router();

// route middleware to verify a token
middlewareRoute.use(function(request, response, next) {

  // check header or url parameters or post parameters for token
  var token = request.body.token || request.query.token || request.headers['x-auth'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, process.env.API_SECRET, function(err, decoded) {
      if (err) {
        return response.status(401).json({ success: false, expired: true, message: 'Failed to authenticate token.'});
      } else {
        // if everything is good, save to request for use in other routes
        request.decoded = decoded;
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return response.status(401).send({
        success: false,
        message: 'No token provided.'
    });

  }
});

module.exports = middlewareRoute;
