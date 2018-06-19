require("../server/config/config");

const express = require("express");
const bodyParser = require("body-parser");

const { mongoose } = require("./db/mongoose");
const { User } = require("./models/User");
const { Todo } = require("./models/Todo");
const _ = require("lodash");

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

const { ObjectId } = mongoose.Types;

//TODOS

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
        return httpResponse.status(404).send();
      }

      httpResponse.status(200).send({ todo });
    },
    err => {
      httpResponse.status(404).send();
    }
  );
});

app.patch("/todos/:id", (httpRequest, httpResponse) => {
  let id = httpRequest.params.id;

  let newBody = _.pick(httpRequest.body, ["text", "completed"]);

  if (_.isBoolean(newBody.completed) && newBody.completed) {
    newBody.completedAt = new Date().getTime();
  } else {
    newBody.completed = false;
    newBody.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, { $set: newBody }, { new: true })
    .then(todo => {
      if (!todo) return httpResponse.sendStatus(404);

      httpResponse.status(200).send({ todo });
    })
    .catch(err => httpResponse.sendStatus(404));
});

//USERS
app.post("/users", (httpRequest, httpResponse) => {
  let body = _.pick(httpRequest.body, ["email", "password"]);
  let user = new User(body);

  user
    .save()
    .then(() => {
      return user.generateAuthToken();
    })
    .then(token => {
      httpResponse.header("x-auth", token).send(user);
    })
    .catch(err => {
      httpResponse.status(400).send(err);
    });
});

app.listen(PORT, () => {
  console.log(`App is running at port ${PORT}`);
});

module.exports = {
  app
};
