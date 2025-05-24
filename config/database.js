const mongoose = require("mongoose");
require("dotenv").config();

exports.connect=()=>{
    mongoose.connect(process.env.MONGODB_URL)
    .then(()=> console.log("connection successfull"))
    .catch(()=>{
        console.log("connection failed");
        console.error(error);
        process.exit(1);

    })
};


