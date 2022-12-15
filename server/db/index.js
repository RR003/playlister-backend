const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

let url =
  "mongodb+srv://stockfluence:stockfluenceapp123@cluster0.kmijl.mongodb.net/?retryWrites=true&w=majority";

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((e) => {
    console.error("Connection error", e.message);
  });

const db = mongoose.connection;

module.exports = db;
