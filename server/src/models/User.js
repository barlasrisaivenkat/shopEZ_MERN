import mongoose from "mongoose";
import bcrypt from "bcrypt";


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
        required:true,
        select:false
    },

    phone:{
        type:String
    },

    role:{
        type:String,
        enum:["user","seller","admin"],
        default:"user"
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
});


// Password hashing
// Password hashing middleware
userSchema.pre("save", async function(){

    if(!this.isModified("password")){
        return;
    }


    this.password = await bcrypt.hash(
        this.password,
        10
    );

});

// Password comparison

userSchema.methods.comparePassword = async function(password){

    return await bcrypt.compare(
        password,
        this.password
    );

};


const User = mongoose.model("User",userSchema);

export default User;