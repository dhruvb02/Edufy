const Course = require("../models/Course");
const Tag = require("../models/Tags");
const User = require("../models/User");
const {uploadImagetoCloudinary} = require("../utils/imageUploader");


//craeateCourse handler function
exports.createCourse = async (params) => {
    try{
        // fetch data
        const {courseName, courseDescription, whatYouWillLearn, price, tag} = req.body;

        // get thimbnail
        const thumbnail = req.files.thumbnailImage;

        // valdation
        if(!course || !courseDescription || !whatYouWillLearn || !price || !tag || !thumbnail){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // check for instructor
        const userId = req.user.id;
        const instructorDetails = await User.findById(userId);
        console.log("Instructor Details : ",instructorDetails );

        

        if(!instructorDetails){
            return res.status(404).json({
                success: false,
                message: "Instructor details not found"
            });
        }

        const tagDetails = await Tag.findById(tag);
        if(!tagDetails){
            return res.status(404).json({
                success: false,
                message: "Tag details not found"
            });
        }

        // upload image to cloudinary

        const thumbnailImage = await uploadImagetoCloudinary(thumbnail, process.env.FOLDER_NAME);

        // create entry for new course:

        const newCourse = await Course.create({courseName, courseDescription, instructor: instructorDetails._id , whatYouWillLearn : whatYouWillLearn, price, tag: tagDetails._id, thumbnail: thumbnailImage.secure_url });


        // user update krna hai that he is teaching that

        await User.findByIdAndUpdate(
            {_id: instructorDetails._id},
            {
                $push:{
                    courses : newCourse._id,
                }
            },
            {new: true},

        );

        // update the tag schema

        //TODO




        return res.status(200).json({
                success: true,
                message: "Course created successfully!"
        });


    }
    catch(error){
        console.error(error);
        return res.status(404).json({
                success: false,
                message: "Failed to create course."
        });
    }
}







//getall courses handler function
exports.showAllCourses = async (req, res) => {
    try {

        const allCourses = await Course.find({});

        return res.status(200).json({
                success: true,
                message: "Courses fetched successfully!"
    });

        
    } 
    catch (error) {
        console.log(error);
        return res.status(500).json({
                success: false,
                message: "Cannot fetch details.",
                error : error.message
        });
        
    }
    
}

