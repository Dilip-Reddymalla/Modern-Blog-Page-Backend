require("dotenv").config();
const app = require("./src/app.js");
const connectToDB = require("./src/config/db");
const fetch = require("node-fetch");

connectToDB();

const PORT = process.env.PORT || 3000;
const URL = "https://modern-blog-page-backend.onrender.com/";

setInterval(() => {
  fetch(URL)
    .then(() => console.log("Self ping success"))
    .catch((err) => console.log("Self ping failed", err.message));
}, 420000);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
