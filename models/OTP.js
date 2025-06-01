const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");

const OTPSchema = new mongoose.Schema({

    email:{
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },

    createdAt:{
        type: Date,
        default: Date.now(),
        expires: 5*60*1000,
    }

    
});

// mail send for authentication; utils mein transporter hai
// this is always after schema before export, you dont want to make an entry in db without authentication

// func to send emails

async function sendVerificationEmail(email,otp){

    try{
        const mailResponse = await mailSender(email, "Verification Email from StudyNotion", otp)
        console.log("email sent successfully: ", mailResponse);
    }

    catch(error){
        console.log("error occured while sending the otp");
        throw error;
    }
}

//pre middleware

OTPSchema.pre("Save", async function(next){
    await sendVerificationEmail(this.email, this.otp);
    next();
})


module.exports = mongoose.model("OTP", OTPSchema );