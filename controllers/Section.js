const Section = require("../models/Section");
const Course = require("../models/Course");


exports.createSection = async (req, res) => {
    try{
        //data fetch
        const {sectionName, courseId} = req.body; 
        //validation
        if(!sectionName || !courseId){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }
        // create section
        const newSection = await Section.create({sectionName});

        // update course with section objectId
        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            {
                $push:{
                    courseContent: newSection._id,
                }
            },
            {new: true},
        )
        // return response 
        return res.status(200).json({
                success: true,
                message: "Section Created successfully!"
        });

    }
    catch(error){
        return res.status(500).json({
                success: false,
                message: "Unable to create section"
        });
    }
    
}



exports.updatedSection = async (req,res) => {
    try{
        const {sectionName, sectionId} = req.body;
        if(!sectionName || !sectionId){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const section = await Section.findByIdAndUpdate(sectionId, {sectionName}, {new: true});

        return res.status(200).json({
                success: true,
                message: "Section Updated successfully!"
        });

    }
    catch(error){
        return res.status(500).json({
                success: false,
                message: "Unable to update section"
        });
    }
}



exports.deleteSection = async (req,res) => {
    try{
        const {sectionId} = req.params;

        await Section.findByIdAndDelete(sectionId);
        return res.status(200).json({
                success: true,
                message: "Section deleted successfully!"
        });

    }
    catch(error){
        return res.status(500).json({
                success: false,
                message: "Unable to delete section"
        });
    }
    
}
    