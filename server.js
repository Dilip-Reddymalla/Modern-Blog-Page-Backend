require('dotenv').config();
const app = require('./src/app.js');
const connectToDB = require('./src/DB/db');


connectToDB();

app.listen(process.env.PORT, ()=>{
    console.log("server is running on port ", process.env.PORT);
});