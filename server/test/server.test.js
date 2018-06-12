const expect = require("expect");
const request = require("supertest");

const { app } = require("../server");
const { Todo } = require("../models/Todo");
const { ObjectID } = require("mongodb");

const sampleTodos = [
  { _id: new ObjectID(), text: "Dance Momoland" },
  { _id: new ObjectID(), text: "Boom boom!" }
];

beforeEach(done => {
  Todo.remove({})
    .then(() => {
      return Todo.insertMany(sampleTodos);
    })
    .then(() => done())
    .catch(err => console.log(err));
});

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
