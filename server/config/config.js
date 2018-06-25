const env = process.env.NODE_ENV || "DEVELOPMENT";
console.log("----", env, "----");

if (env === "DEVELOPMENT") {
  process.env.PORT = 3000;
  process.env.MONGO_URI = "mongodb://localhost:27017/TodoApp";
} else if (env === "TEST") {
  process.env.PORT = 3000;
  process.env.MONGO_URI = "mongodb://localhost:27017/TodoAppTest";
}
