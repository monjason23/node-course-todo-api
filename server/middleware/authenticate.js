const { User } = require("../models/User");

var authenticate = (httpRequest, httpResponse, next) => {
  var token = httpRequest.header("x-auth");

  User.findByToken(token)
    .then(user => {
      if (!user) {
        return Promise.reject();
      }
      httpRequest.user = user;
      httpRequest.token = token;
      next();
    })
    .catch(err => {
      httpResponse.status(401).send(err);
    });
};

module.exports = { authenticate };
