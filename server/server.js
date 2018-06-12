const express = require("express");
const bodyParser = require("body-parser");

const { mongoose } = require("./db/mongoose");
const { User } = require("./models/User");
const { Todo } = require("./models/Todo");

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

const { ObjectId } = mongoose.Types;

app.post("/todos", (httpRequest, httpResponse) => {
  let newTodo = new Todo({
    text: httpRequest.body.text
  });

  newTodo.save().then(
    result => {
      httpResponse.status(200).send(result);
    },
    error => {
      httpResponse.status(400).send(error);
    }
  );
});

app.get("/todos", (httpRequest, httpResponse) => {
  Todo.find().then(
    todos => {
      httpResponse.send({ todos });
    },
    err => {
      httpResponse.status(400).send(err);
    }
  );
});

app.get("/todos/:id", (httpRequest, httpResponse) => {
  let id = httpRequest.params.id;

  if (!ObjectId.isValid(id)) httpResponse.status(404).send();

  Todo.findById(id)
    .then(todo => {
      if (!todo) {
        return httpResponse.status(404).send("Todo not found");
      }
      httpResponse.status(200).send({ todo });
    })
    .catch(err => {
      httpResponse.status(404).send();
    });
});

app.delete("/todos/:id", (httpRequest, httpResponse) => {
  let id = httpRequest.params.id;

  if (!ObjectId.isValid(id)) httpResponse.sendStatus(404);

  Todo.findByIdAndRemove(id).then(
    todo => {
      if (!todo) {
        return httpResponse.sendStatus(404);
      }

      httpResponse.status(200).send({ todo });
    },
    err => {
      httpResponse.sendStatus(404);
    }
  );
});

app.listen(PORT, () => {
  console.log(`App is running at port ${PORT}`);
});

module.exports = {
  app
};
