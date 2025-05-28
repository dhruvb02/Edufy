const Profile = require("../models/Profile");
const User = require("../models/User");
const Courses = require("../models/Course");


exports.updateProfile = async (req,res) => {
    try{
        // get data
        const {dateOfBith ="", about="", contactNumber, gender} = req.body;
        // get userid
        const id = req.user.id;
        //validation
        if(!contactNumber || !gender){
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }
        //find profile
        const userDetails = await User.findById(id);
        const profileId = userDetails.additionalDetails;
        const profileDetails = await Profile.findById(profileId);

        //update profile
        profileDetails.dateOfBirth = dateOfBith;
        profileDetails.about = about;
        profileDetails.gender = gender;
        profileDetails.contactNumber = contactNumber;
        await profileDetails.save();


        //return response
        return res.status(200).json({
            success: true,
            message: "Profile updated!",
        });

    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: "Profile could not be updated",
        });
    }
    
}


//delete account

exports.deleteAccount = async (req,res) => {
    try {
        //get id
        const id = req.user.id;
        // validation
        const userDetails = await User.findById(id);
        if(!userDetails){
            return res.status(404).json({
                success: false,
                message: 'User not found!'
            })
        }
        // delete user from user as well as profile
        await Profile.findByIdAndDelete({_id: userDetails.additionalDetails});

        // enrol count se bhi delete
        await Course.updateMany(
            { students: id },
            {
                $pull: { students: id },
                $inc: { numEnrolled: -1 }    // only if you track count manually
            }
    );
        


        await User.findByIdAndDelete({_id:id});

        
        // return
        return res.status(200).json({
                success: true,
                message: 'User account deleted!'
        })

    } catch (error) {
       return res.status(500).json({
                success: false,
                message: 'User not found!'
        }) 
    }
    
}

exports.UserDetails = async (req, res) => {
    try {
        const id = req.user.id;
        const userDetails = await User.findById(id).populate("additionalDetails").exec();
        return res.status(200).json({
                success: true,
                message: 'User data fetched successfully!'
        })

    } catch (error) {
        return res.status(404).json({
                success: false,
                message: 'User data cannot be fetched!'
        });
    }   
}