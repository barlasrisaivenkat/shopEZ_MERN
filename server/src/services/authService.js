import jwt from "jsonwebtoken";
import User from "../models/User.js";


const generateToken = (id)=>{

    return jwt.sign(
        {id},
        process.env.JWT_SECRET,
        {
            expiresIn:process.env.JWT_EXPIRES_IN || "7d"
        }
    );

};



// Register

export const registerUser = async({
    name,
    email,
    password,
    role
})=>{


    const existingUser = await User.findOne({
        email
    });


    if(existingUser){
        throw {
            statusCode:400,
            message:"Email already registered"
        };
    }



    const user = await User.create({

        name,
        email,
        password,

        role:["admin","seller"].includes(role)?role:"user"
    });



    const token = generateToken(user._id);



    return {

        token,

        user:{
            _id:user._id,
            name:user.name,
            email:user.email,
            role:user.role
        }

    };

};




// Login

export const loginUser = async({
    email,
    password
})=>{


    const user = await User
    .findOne({email})
    .select("+password");



    if(!user){

        throw{
            statusCode:401,
            message:"Invalid email or password"
        };

    }



    const isMatch =
    await user.comparePassword(password);



    if(!isMatch){

        throw{
            statusCode:401,
            message:"Invalid email or password"
        };

    }



    const token =
    generateToken(user._id);



    return{

        token,

        user:{
            _id:user._id,
            name:user.name,
            email:user.email,
            role:user.role
        }

    };

};




// Profile

export const getProfile = async(userId)=>{


    const user =
    await User.findById(userId);



    if(!user){

        throw{
            statusCode:404,
            message:"User not found"
        };

    }


    return user;

};



// Update profile

export const updateProfile = async(
    userId,
    data
)=>{


    const user =
    await User.findByIdAndUpdate(
        userId,
        data,
        {
            new:true,
            runValidators:true
        }
    );


    if(!user){

        throw{
            statusCode:404,
            message:"User not found"
        };

    }


    return user;

};



// Change password

export const changePassword = async(
    userId,
    {
        currentPassword,
        newPassword
    }
)=>{


    const user =
    await User.findById(userId)
    .select("+password");



    const isMatch =
    await user.comparePassword(
        currentPassword
    );



    if(!isMatch){

        throw{
            statusCode:400,
            message:"Wrong current password"
        };

    }



    user.password = newPassword;

    await user.save();

};




// Admin

export const getAllUsers = async()=>{

    return await User.find();

};



export const deleteUser = async(id)=>{

    await User.findByIdAndDelete(id);

};