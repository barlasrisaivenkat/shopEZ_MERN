import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
{
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    orderItems:[
        {
            product:{
                type: mongoose.Schema.Types.ObjectId,
                ref:"Product",
                required:true
            },

            name:{
                type:String,
                required:true
            },

            quantity:{
                type:Number,
                required:true
            },

            price:{
                type:Number,
                required:true
            },

            image:{
                type:String,
                default:""
            }
        }
    ],


    shippingAddress:{
        fullName:{
            type:String,
            required:true
        },

        phone:{
            type:String,
            required:true
        },

        street:{
            type:String,
            required:true
        },

        city:{
            type:String,
            required:true
        },

        state:{
            type:String,
            required:true
        },

        pincode:{
            type:String,
            required:true
        },

        country:{
            type:String,
            required:true
        }
    },


    paymentMethod: {
    type: String,
    enum: [
        "cash_on_delivery",
        "upi",
        "razorpay",
        "stripe"
    ],
    default: "cash_on_delivery"
},


    paymentStatus:{
        type:String,
        enum:[
            "pending",
            "paid",
            "failed"
        ],
        default:"pending"
    },


    orderStatus:{
        type:String,
        enum:[
            "pending",
            "processing",
            "shipped",
            "delivered",
            "cancelled"
        ],
        default:"pending"
    },


    totalPrice:{
        type:Number,
        required:true,
        default:0
    }

},
{
    timestamps:true
});


const Order = mongoose.model("Order", orderSchema);

export default Order;