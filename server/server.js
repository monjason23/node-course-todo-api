const express = require("express");
const bodyParser = require("body-parser");

const { mongoose } = require("./db/mongoose");
const { User } = require("./models/User");
const { Todo } = require("./models/Todo");

const app = express();
app.use(bodyParser.json());

const PORT = 3000 || process.env.PORT;

app.post("/todos", (httpRequest, httpResponse) => {
  let newTodo = new Todo({
    text: httpRequest.body.text
  });

  newTodo.save().then(
    result => {
      httpResponse.status(200).send(result);
    },
    error => {
      console.log(error);
    }
  );
});

app.listen(PORT, () => {
  console.log("App is running at port 3000");
});

module.exports = {
  app
};
