const mongoose=require("mongoose");

const orderSchema=new mongoose.Schema({

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

    products:[
        {

            product:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Product"
            },

            quantity:Number,

            price:Number

        }
    ],

    shippingAddress:{
        fullName:String,
        phone:String,
        street:String,
        city:String,
        state:String,
        pincode:String,
        country:String
    },

    totalAmount:Number,

    status:{
        type:String,
        enum:[
            "Pending",
            "Confirmed",
            "Packed",
            "Shipped",
            "Delivered",
            "Cancelled"
        ],
        default:"Pending"
    },

    paymentStatus:{
        type:String,
        enum:["Pending","Paid","Failed"],
        default:"Pending"
    }

},{
    timestamps:true
});

module.exports=mongoose.model("Order",orderSchema);