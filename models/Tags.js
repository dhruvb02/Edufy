const mongoose = require("mongoose");

const tagsSchema = new mongoose.Schema({

    name:{
        type: String,
        required: true,
    },
    description: {
        typr: String,
        required: true,
    },
    course: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",

    }]


    
});

module.exports = mongoose.model("RatingAndReview", ratingAndReviewSchema );