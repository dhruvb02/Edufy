//forgot password
//link is generated and sent to email
// website par le ayega for new password

const User = require("../models/User");
const OTP = require("../models/OTP");
const Profile = require("../models/Profile");
const bcrypt = require("bcrypt")

const mailSender = require("../utils/mailSender");

const crypto = require("crypto");

///resetpassword token 
exports.resetPasswordToken = async (req,res) => {

    try{
        //get email
        const email = req.body.email;



        //check user for this email
        const user = await User.findOne({email: email});
        if(!user){
            return res.status(401).json({
                success: false,
                message: "User not registered"
            })
        }

        //generate token
        const token = crypto.randomUUID();
        //update user by adding token and expiration time
        const updatedDetails = await User.findOneAndUpdate({email:email},{token: token, resetPasswordExpires: Date.now()+ 5*60*1000}, {new: true}); 
        //link generation and send link

        const url = `https://localhost:3000/update-password/${token}`;
        // send mail
        await mailSender(email,"Password Reset Link - Edufy", `Password reset link : ${url}`);


        return res.json({
            success: true,
            message: "Email sent successfully. Please check your email for password reset link.",
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong.",
        })
    }
    
    
};


///reset password

exports.resetPassword = async (req,res) => {
    try{
            //data fetch karo jo user ne daala
        const {password, confirmPassword, token}= req.body;

        //validation
        if(password!== confirmPassword){
            return res.json({
                success: false,
                messsage: "Password and Aconfirm Password does not match",
            });
        };
        //get user details using token
        const userDetails = await User.findOne({token : token});
        // no entry : invalid token
        if(!userDetails){
            return res.json({
                success: false,
                messsage: "Token invalid.",
            });
        }
        // token time check if expired or not
        if(userDetails.resetPasswordExpires < Date.now()){
             return res.json({
                success: false,
                messsage: "Link Expired. Please regenerate the link.",
            });
        }
        // hash password
        const hashPassword = await bcrypt.hash(password,10);
        //update password
        await User.findOneAndUpdate({token:token}, {password: hashPassword}, {new: true});
            return res.json({
                success: true,
                messsage: "Password updated successfully..",
            });
        
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
                success: false,
                messsage: "Something went wrong",
        });

    }
    
};