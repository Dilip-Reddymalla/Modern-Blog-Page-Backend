require("dotenv").config();
const app = require("./src/app.js");
const connectToDB = require("./src/config/db");
const fetch = require("node-fetch");

connectToDB();

const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
