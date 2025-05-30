const User = require("../models/User");
const OTP = require("../models/OTP");
const Profile = require("../models/Profile");

const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const  jwt = require("jsonwebtoken");

require("dotenv").config();

///sendotp
exports.sendOTP = async(req,res) =>{

   try{
     //fetch email form req ki body
        const {email} = req.body;

        // check if user exists
        const checkUser = await User.findOne({email});

        /// if user already exists the
        if(checkUser){
            return res.status(401).json({
                success: false,
                message: "User already exists"
            });
        }

    // generate otp
    let otp= otpGenerator.generate(6,{
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
    });
    console.log("otp generated");

    // check unique otp or not
    const result= await OTP.findOne({otp: otp});

    while(result){
        otp= otpGenerator.generate(6,{
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
        });
    }

    // now otp ko db mein daalo

    const otpPayload= {email,otp};

    const otpBody = await OTP.create(otpPayload);
    console.log (otpBody);

   // return successfull response
   
   res.status(200).json({
        success: true,
        messgae: "OTP sent successfully",
        otp,
   });


   }
   catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
   }




};



/// sign up
exports.signUp = async(req,res) =>{
   try{
     //data fetch from req ki body
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp
        } = req.body;


        // validate the entry

        if(!firstName || !lastName || !email || !password || !confirmPassword || !otp){
            return res.status(403).json({
                success: false,
                message: "All fields are required"
            })
        }
        
        // 2 password match 

        if(password!== confirmPassword){
            return res.status(400).json({
                success: false,
                message: "Password and Confirm Password does not match",
            })
        }

        // check user already exist or not
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success: false,
                message: "User already exists",
            })
        }



        // find most receent otp and usko laao
        const latestOtp = await OTP.findOne({email}).sort({createdAt: -1}).limit(1);

        // validate otp
        if(latestOtp.length == 0){
            return res.status(400).json({
                success: false,
                message: "OTP not Found"
            })
        }
        else if(otp !== latestOtp.otp ){
            return res.status(400).json({
                success: false,
                message: "OTP does not match"
            })

        }


        // hash password
        const hashPassword = await bcrypt.hash(password,10);

        // create entry in db
        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contact: null,
        });

        const user  = await User.create({
            firstName,
            lastName,
            email,
            password: hashPassword,
            accountType,
            additionalDetails: profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
        })

        // return res
        return res.status(200).json({
            success: true,
            message: "User Registered Successfully!"
        })
   }
   catch(error){    
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "User could not be registered. Please try again."
        })

   }

};





/// log in


exports.login= async(req, res) =>{
    try{
        // req ki body se data
        const {email,password}= req.body;

        if(!email || !password){
            return res.status(403).json({
                success: false,
                message: "All fields are required"
            })
        }

        // user check

        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({
                success: false,
                message: "User not Found. Please signup if account does not exist."

            });
        }

        // password matching, then generate json token
        if(await bcrypt.compare(password, user.password)){
            const payload={
                email: user.email,
                id: user._id,
                accountType: user.accountType,
            }
            const token= jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "2h",
            });

            user.token = token;
            user.password = undefined;

            // create cookie and send response
            const options ={
                expires: new Date(Date.now() + 3*24*60*60*1000),
                httpOnly: true,
            }

            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: "Logged in Successfully",
            })

        }
        else{
            return res.status(401).json({
                success: false,
                message : "Password is incorrect",
            })
        }


    }
    catch(error){
        console.log(error);
        return res.status(500).json({
                success: false,
                message : "Login Failure, Please try again.",
        })
    }
}



//change password
    exports.changePassword = async(req,res) =>{
        // get data from req body
        // get oldpass, newpass, confirm pass
        //validation

        // update in db
        // send mail - password changed
        // return response
    }