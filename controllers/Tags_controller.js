const Tag = require("../models/Tags");


// create handler function
exports.createTag = async(req,res) =>{
    try{
        const {name, description} = req.body;

        // validation

        if(!name|| !description){
            return res.status(400).json({
            succes: false,
            message: "All fields are required",
            })
        }

        // create entry in db

        const tagDetails = await Tag.create({
            name: name,
            description: description,

        });

        console.log(tagDetails);

        return res.status(200).json({
            succes: true,
            message: "Tags created successfully !",
        })




    }
    catch(error){
        return res.status(500).json({
            succes: false,
            message: error.message,
        })
    }
};


//get all tags handler

exports.showAllTags = async (req,res) => {
    try{
        const allTags = await Tag.find({},{name: true, description: tru});
        return res.status(200).json({
            succes: true,
            message: "All tags returned successfully!",
            allTags,

        });

    }
    
    catch(error){
        return res.status(500).json({
            succes: false,
            message: error.message,
        })
    }
}
