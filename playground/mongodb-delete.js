const { MongoClient, ObjectID } = require("mongodb");

MongoClient.connect(
  "mongodb://localhost:27017/TodoApp",
  { useNewUrlParser: true },
  (err, client) => {
    if (err) return console.log(err);

    const db = client.db("TodoApp");

    // db
    //   .collection("Users")
    //   .deleteMany({ name: "Jael" })
    //   .then(result => console.log(result))
    //   .catch(err => console.log(err));

    db
      .collection("Users")
      .findOneAndDelete({ name: "Lee" })
      .then(result => console.log(result))
      .catch(err => console.log(err));

    db
      .collection("Users")
      .findOneAndDelete({ _id: new ObjectID("5b0d643ae7b213026d685b74") })
      .then(result => console.log(result))
      .catch(err => console.log(err));
  }
);
