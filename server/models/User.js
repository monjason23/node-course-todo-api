const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const bycrypt = require("bcryptjs");

const Schema = mongoose.Schema;

let UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: "{VALUE} is not a valid email"
    }
  },
  password: {
    type: String,
    minlength: 6,
    required: true
  },
  tokens: [
    {
      access: {
        type: String,
        required: true
      },
      token: {
        type: String,
        required: true
      }
    }
  ]
});

UserSchema.methods.toJSON = function() {
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject, ["_id", "email"]);
};

UserSchema.methods.generateAuthToken = function() {
  var user = this;
  var access = "auth";
  var token = jwt
    .sign(
      {
        _id: user._id.toHexString(),
        access
      },
      "aaa111"
    )
    .toString();

  user.tokens = user.tokens.concat([{ access, token }]);

  return user.save().then(() => {
    return token;
  });
};

UserSchema.statics.findByCredentials = function(email, password) {
  var User = this;

  return User.findOne({ email }).then(user => {
    if (!user) {
      return Promise.reject();
    }
    return bycrypt.compare(password, user.password).then(result => {
      if (!result) return Promise.reject();
      return user;
    });
  });
};

UserSchema.statics.findByToken = function(token) {
  var User = this;
  var decode;

  try {
    decode = jwt.verify(token, "aaa111");
  } catch (e) {
    return Promise.reject();
  }

  return User.findOne({
    _id: decode._id,
    "tokens.token": token,
    "tokens.access": "auth"
  });
};

UserSchema.pre("save", function(next) {
  var user = this;
  if (user.isModified("password")) {
    bycrypt.genSalt(10, (err, salt) => {
      bycrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else next();
});

var User = mongoose.model("User", UserSchema);

module.exports = {
  User
};
