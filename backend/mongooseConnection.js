const mongoose = require("mongoose");

const conUrl = process.env.MONGO_URL;
const dbname = "MyHelpers";

mongoose.connect(`${conUrl}/${dbname}`).then(() => {
  console.log("connected with mongodb");
});
