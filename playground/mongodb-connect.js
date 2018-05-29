const { MongoClient, ObjectID } = require("mongodb");

MongoClient.connect(
  "mongodb://localhost:27017/TodoApp",
  { useNewUrlParser: true },
  (err, client) => {
    if (err) return console.log("Unable to connect to database");

    console.log("You are now connect to the database");
    const db = client.db("TodoApp");

    db.collection("Todos").insertOne(
      {
        text: "Something to do",
        completed: false
      },
      (err, result) => {
        if (err) return console.log("Unable to insert todo", err);

        console.log("Inserting data succesful");
        console.log(JSON.stringify(result.ops, undefined, 2));
      }
    );

    db.collection("Users").insertOne(
      {
        name: "Mon Jason",
        location: "Makati City",
        age: 24
      },
      (err, result) => {
        if (err) return console.log("Unable to insert", err);

        console.log("Done inserting: ");
        console.log(result.ops[0]._id.getTimestamp());
        console.log(JSON.stringify(result.ops, undefined, 2));
      }
    );

    client.close();
  }
);
