const { ObjectID } = require("mongodb");
const { Todo } = require("../../models/Todo");
const { User } = require("../../models/User");
const jwt = require("jsonwebtoken");

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const sampleUsers = [
  {
    _id: userOneId,
    email: "mon@sample.com",
    password: "monpass",
    tokens: [
      {
        access: "auth",
        token: jwt
          .sign({ _id: userOneId.toHexString(), access: "auth" }, "aaa111")
          .toString()
      }
    ]
  },
  {
    _id: userTwoId,
    email: "jason@sample.com",
    password: "jasonpass",
    tokens: [
      {
        access: "auth",
        token: jwt
          .sign({ _id: userOneId.toHexString(), access: "auth" }, "aaa111")
          .toString()
      }
    ]
  }
];

const sampleTodos = [
  { _id: new ObjectID(), text: "Dance Momoland" },
  { _id: new ObjectID(), text: "Boom boom!", completedAt: 333 }
];

const populateTodos = done => {
  Todo.remove({})
    .then(() => {
      return Todo.insertMany(sampleTodos);
    })
    .then(() => done())
    .catch(err => console.log(err));
};

const populateUsers = done => {
  User.remove({})
    .then(() => {
      var user1 = new User(sampleUsers[0]).save();
      var user2 = new User(sampleUsers[1]).save();

      Promise.all([user1, user2]);
    })
    .then(() => done())
    .catch(err => console.log(err));
};

module.exports = { sampleTodos, sampleUsers, populateTodos, populateUsers };
