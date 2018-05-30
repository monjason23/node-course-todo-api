const { MongoClient, ObjectID } = require("mongodb");

MongoClient.connect(
  "mongodb://localhost:27017/TodoApp",
  { useNewUrlParser: true },
  (err, client) => {
    if (err) return console.log("Unable to connect");

    const db = client.db("TodoApp");

    db.collection("Todos").findOneAndUpdate(
      { _id: new ObjectID("5b0ec415ce701c24bb3b3f04") },
      {
        $set: {
          completed: true
        }
      },
      {
        returnOriginal: false
      },
      (err, result) => {
        console.log(JSON.stringify(result, undefined, 2));
      }
    );

    db.collection("Users").findOneAndUpdate(
      { _id: new ObjectID("5b0ec2e6ce701c24bb3b3ea2") },
      {
        $set: {
          name: "Joshua"
        },
        $inc: {
          age: -2
        }
      },
      {
        returnOriginal: false
      },
      (err, result) => {
        console.log(JSON.stringify(result, undefined, 2));
      }
    );
  }
);
