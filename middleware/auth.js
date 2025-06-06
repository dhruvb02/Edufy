const jwt  = require("jsonwebtoken");
const dotenv = require('dotenv');
dotenv.config();
const User = require("../models/User");


// auth

exports.auth = async(req,res , next) =>{
    try{
        //extract token
        const token = req.cookies.token || req.body.token || req.header("Authorisation").replace("Bearer ","");

        // if token is missing then
        if(!token){
            return res.status(401).json({
                success: false,
                message: "Token is missing",
            });
        }

        //verify the token
        try{
            const decode = await jwt.verify(token,process.env.JWT_SECRET);
            console.log(decode);
            req.user=decode;
        }
        catch(err){
            return res.status(401).json({
                success: false,
                message: "token invalid",
            })
        }
        next();
    }
    catch(error){
        return res.status(401).json({
            success: false,
            message:"Token validation could not be done"
        })

    }
}


// authorization

//isStudent
exports.isStudent = async(res,req,next) =>{
    try{
        if(req.user.accountType!== "Student"){
            return res.status(401).json({
            success: false,
            message:"This is a proctected route for students only"
        })
        }
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message:"User role cannot be verified."
        })
    }
}


//isInstructor
exports.isInstructor = async(res,req,next) =>{
    try{
        if(req.user.accountType!== "Instructor"){
            return res.status(401).json({
            success: false,
            message:"This is a proctected route for instructors only"
        })
        }
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message:"User role cannot be verified."
        })
    }
}

//isAdmin
exports.isAdmin = async(req,res,next) =>{
    try{
        console.log(req.user.accountType)
        if(req.user.accountType!== "Admin"){
            return res.status(401).json({
            success: false,
            message:"This is a proctected route for admins only"
        })
        }
        next();
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message:"User role cannot be verified."
        })
    }
}

