import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
{
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true
    },
    phone:{
        type:String
    },
    role:{
        type:String,
        enum:["customer","seller","admin"],
        default:"customer"
    },
    avatar:{
        type:String
    },
    address:[
        {
            fullName:String,
            phone:String,
            street:String,
            city:String,
            state:String,
            pincode:String,
            country:String
        }
    ],
    isVerified:{
        type:Boolean,
        default:false
    }
},
{
    timestamps:true
}
);
const User = mongoose.model("User",userSchema);
export default User;