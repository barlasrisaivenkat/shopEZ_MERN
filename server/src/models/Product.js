import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
{
    title:{
        type:String,
        required:true
    },

    description:{
        type:String,
        required:true
    },

    price:{
        type:Number,
        required:true
    },

    discount:{
        type:Number,
        default:0
    },

    stock:{
        type:Number,
        required:true
    },

    brand:{
        type:String
    },


    images:[
        String
    ],


    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
        required:true
    },


    seller:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },


    // Review fields
    rating:{
        type:Number,
        default:0
    },


    numReviews:{
        type:Number,
        default:0
    }

},
{
    timestamps:true
});


const Product = mongoose.model("Product", productSchema);

export default Product;