const mongoose=require("mongoose");

const productSchema=new mongoose.Schema({

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

    brand:String,

    images:[
        String
    ],

    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category"
    },

    seller:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

    averageRating:{
        type:Number,
        default:0
    }

},{
    timestamps:true
});

module.exports=mongoose.model("Product",productSchema);