const { mongoose } = require("../server/db/mongoose");
const { Todo } = require("../server/models/Todo");
const { User } = require("../server/models/User");

const myId = "5b13a5399a9f5e0298572a67";

User.find({
  _id: myId
})
  .then(user => {
    console.log(JSON.stringify(user, undefined, 2));
  })
  .catch(err => console.log(err));

User.findOne({
  _id: myId
})
  .then(user => {
    console.log(JSON.stringify(user, undefined, 2));
  })
  .catch(err => console.log(err));

User.findById(myId)
  .then(user => {
    if (!user) {
      return console.log("User does not exist!");
    }
    console.log(JSON.stringify(user, undefined, 2));
  })
  .catch(err => console.log(err));
