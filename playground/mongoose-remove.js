const { mongoose } = require("../server/db/mongoose");
const { User } = require("../server/models/User");
const { Todo } = require("../server/models/Todo");

Todo.findByIdAndRemove({ _id: "5b1d36de9ad5fa07a00a6ea5" }).then(
  result => {
    console.log(result);
  },
  error => {
    console.log(error);
  }
);
