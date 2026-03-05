const mongoose = require('mongoose');

async function connectToDB() {
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");
    }catch{
        console.log("Database Connection error");
    }
}

module.exports = connectToDB;