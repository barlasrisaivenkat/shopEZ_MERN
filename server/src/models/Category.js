import mongoose from "mongoose";

const categorySchema=new mongoose.Schema({

    name:{
        type:String,
        required:true,
        unique:true
    },

    image:String,

    description:String

},{
    timestamps:true
});

const Category = mongoose.model("Category",categorySchema);

export default Category;