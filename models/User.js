const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trime: true,
    },
    lastName: {
        type: String,
        required: true,
        trime: true,
    },
    email:{
        type: String,
        required: true,
        trime: true,
    },
    password:{
        type: String,
        required: true,
        
    },
    accountType:{
        type: String,
        required: true,
        enum:["Admin","Student", "Instructor"],
    },
    additionalDetails:{
        type: mongoose.Schema.Types.ObjectId,
        reqiured: true,
        ref: "Profile",
    },
    courses:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
        }
    ],
    image:{
        type: String,
        required: true,
    },
    token:{
        type: String,

    },
    resetPasswordExpires:{
        type: Date,
    },
    courseProgress :[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CourseProgress",
        }
    ]

});

module.exports = mongoose.model("Users", userSchema);