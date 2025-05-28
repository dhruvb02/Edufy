const Section = require("../models/Section");
const Course = require("../models/Course");
const SubSection = require("../models/SubSection");
const { uploadImagetoCloudinary } = require("../utils/imageUploader");


exports.createSubSection = async (req, res) => {
    try{
        //data fetch
        const {sectionId, title, timeDuration, description} = req.body; 
        // extract file
        const video = req.files.videoFile;
        //validation
        if(!sectionId || !title ||!timeDuration || !description){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }
        // file upload to cloudinary
        const uploadDetails = await uploadImagetoCloudinary(video, process.env.FOLDER_NAME);

        // create a subsection
        const SubSectionDetails = await SubSection.create({
            title: title,
            timeDuration: timeDuration,
            description: description,
            videoUrl: uploadDetails.secure_url,
            }
        )

        //update section with this subsection objectid
        const updatedSection = await Section.findOneAndUpdate(
            {_id: sectionId},
            {$push:{
                subSection: SubSectionDetails._id,
            }},
            {new:true}
        )

        // return response 
        return res.status(200).json({
                success: true,
                message: "Sub-Section Created successfully!",
                updatedSection,
        });

    }
    catch(error){
        return res.status(500).json({
                success: false,
                message: "Unable to create sub-section"
        });
    }
    
}



exports.updateSubSection = async (req, res) => {
    try {
        const { subSectionId, title, timeDuration, description } = req.body;

        const updates = {};
        if (title) updates.title = title;
        if (timeDuration) updates.timeDuration = timeDuration;
        if (description) updates.description = description;

        if (req.files && req.files.videoFile) {
            const video = req.files.videoFile;
            const uploadDetails = await uploadImagetoCloudinary(video, process.env.FOLDER_NAME);
            updates.videoUrl = uploadDetails.secure_url;
        }

        const updatedSubSection = await SubSection.findByIdAndUpdate(
            subSectionId,
            updates,
            { new: true }
        );

        if (!updatedSubSection) {
            return res.status(404).json({
                success: false,
                message: "Sub-section not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Sub-section updated successfully!",
            updatedSubSection,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error updating sub-section",
        });
    }
};




exports.deleteSubSection = async (req, res) => {
    try {
        const { subSectionId, sectionId } = req.body;

        if (!subSectionId || !sectionId) {
            return res.status(400).json({
                success: false,
                message: "SubSection ID and Section ID are required",
            });
        }

        // Delete the sub-section
        const deletedSubSection = await SubSection.findByIdAndDelete(subSectionId);

        if (!deletedSubSection) {
            return res.status(404).json({
                success: false,
                message: "Sub-section not found",
            });
        }

        // Remove the sub-section reference from the section
        await Section.findByIdAndUpdate(
            sectionId,
            { $pull: { subSection: subSectionId } },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "Sub-section deleted successfully!",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error deleting sub-section",
        });
    }
};
