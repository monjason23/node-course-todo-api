const { MongoClient, ObjectID } = require("mongodb");

MongoClient.connect(
  "mongodb://localhost:27017/TodoApp",
  { useNewUrlParser: true },
  (err, client) => {
    if (err) return console.log(err);

    const db = client.db("TodoApp");

    db
      .collection("Todos")
      .find({ _id: new ObjectID("5b0d5f6bc479e7f81caebb1e") })
      .toArray()
      .then(doc => console.log(doc))
      .catch(err => console.log(err));

    db
      .collection("Users")
      .find({ name: "Jael" })
      .toArray()
      .then(doc => console.log(JSON.stringify(doc, undefined, 2)))
      .catch(err => console.log(err));
  }
);
