require("../config/config");

const expect = require("expect");
const request = require("supertest");

const { app } = require("../server");
const { Todo } = require("../models/Todo");
const { User } = require("../models/User");
const { ObjectID } = require("mongodb");

const {
  sampleTodos,
  sampleUsers,
  populateTodos,
  populateUsers
} = require("./seed/seed");

beforeEach(populateTodos);
beforeEach(populateUsers);

//---TODOS---//

describe("POST /todos", () => {
  it("Should create a new todo", done => {
    let text = "Sample todo text";

    request(app)
      .post("/todos")
      .send({ text })
      .expect(200)
      .expect(res => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) return done(err);

        Todo.find({ text })
          .then(todos => {
            expect(todos.length).toBe(1);
            expect((todos[0].text = text));
            done();
          })
          .catch(err => done(err));
      });
  });

  it("should not create todo with invalid body data", done => {
    request(app)
      .post("/todos")
      .send({ text: "" })
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find()
          .then(todos => {
            expect(todos.length).toBe(2);
            return done();
          })
          .catch(e => done(e));
      });
  });
});

describe("GET /todos", () => {
  it("Should list all todos", done => {
    request(app)
      .get("/todos")
      .expect(200)
      .expect(res => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });
});

describe("GET /todos/id", () => {
  it("Should retrieve a valid todo with the provided id", done => {
    request(app)
      .get(`/todos/${sampleTodos[0]._id.toHexString()}`)
      .expect(res => {
        expect(res.body.todo.text).toBe(sampleTodos[0].text);
      })
      .end(done);
  });

  it("Should return 404 when todo id is not found", done => {
    let newId = new ObjectID();

    request(app)
      .get(`/todos/${newId.toHexString()}}`)
      .expect(404)
      .end(done);
  });

  it("Should return 404 when todo id is not valid object id", done => {
    request(app)
      .get(`/todos/123`)
      .expect(404)
      .end(done);
  });
});

describe("DELETE /todos/id", () => {
  it("Should remove a todo", done => {
    let hexID = sampleTodos[1]._id.toHexString();
    request(app)
      .delete(`/todos/${hexID}`)
      .expect(200)
      .expect(res => {
        expect(res.body.todo._id).toBe(hexID);
      })
      .end((err, res) => {
        if (err) return done(err);

        Todo.findById(hexID)
          .then(todo => {
            expect(todo).toNotExist();
          })
          .then(done)
          .catch(err => done(err));
      });
  });

  it("Should return 404 if todo not found", done => {
    let hexID = new ObjectID().toHexString();
    request(app)
      .delete(`/todos/${hexID}`)
      .expect(404)
      .end(done);
  });

  it("Should return 404 when todo id is not valid object id", done => {
    request(app)
      .delete(`/todos/abc123`)
      .expect(404)
      .end(done);
  });
});

describe("PATCH /todos/id", () => {
  let hexID = sampleTodos[1]._id.toHexString();

  it("Should update the todo", done => {
    let newText = "Updated text!";

    request(app)
      .patch(`/todos/${hexID}`)
      .send({ text: newText, completed: true })
      .expect(200)
      .expect(res => {
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.text).toBe(newText);
        expect(res.body.todo.completedAt).toBeA("number");
        done();
      })
      .end((err, res) => {
        if (err) return done(err);
      });
  });

  it("Should clear completedAt when completed is false", done => {
    request(app)
      .patch(`/todos/${hexID}`)
      .send({ completed: false })
      .expect(200)
      .expect(res => {
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toNotExist();
        done();
      })
      .end((err, res) => {
        if (err) return done(err);
      });
  });
});

//---USERS---//

describe("GET /users/me", () => {
  it("Should return 401 error when not authorized", done => {
    request(app)
      .get("/users/me")
      .expect(401)
      .expect(res => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });

  it("Should return a user when authenticated", done => {
    request(app)
      .get("/users/me")
      .set("x-auth", sampleUsers[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body._id).toBe(sampleUsers[0]._id.toHexString());
        expect(res.body.email).toBe(sampleUsers[0].email);
      })
      .end(done);
  });
});

describe("POST /users", () => {
  it("Should create a new user", done => {
    var email = "email@test.com";
    var password = "passtest";

    request(app)
      .post("/users")
      .send({ email, password })
      .expect(200)
      .expect(res => {
        expect(res.headers["x-auth"]).toExist();
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(email);
      })
      .end(err => {
        if (err) return done(err);

        User.findOne({ email })
          .then(user => {
            expect(user).toExist();
            expect(user.password).toNotBe(password);
            done();
          })
          .catch(err => done(err));
      });
  });

  it("Should return 400 invalid email or password", done => {
    request(app)
      .post("/users")
      .send({
        email: "hello.com",
        password: "not6"
      })
      .expect(400)
      .end(done);
  });

  it("Should return 400 if email is already taken", done => {
    request(app)
      .post("/users")
      .send({
        email: "mon@sample.com",
        password: "thisistrue"
      })
      .expect(400)
      .end(done);
  });
});
