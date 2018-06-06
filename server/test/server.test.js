const expect = require("expect");
const request = require("supertest");

const { app } = require("../server");
const { Todo } = require("../models/Todo");

const sampleTodos = [{ text: "Dance Momoland" }, { text: "Boom boom!" }];

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
      .end(done());
  });
});
