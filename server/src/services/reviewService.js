import Review from "../models/Review.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";


// Get all reviews of product

export const getProductReviews = async (productId) => {

    return await Review.find({
        product:productId
    })
    .populate("user","name avatar")
    .sort({
        createdAt:-1
    });

};




// Add Review

export const addReview = async (
    userId,
    productId,
    {rating,comment}
)=>{


    const product = await Product.findById(productId);

    if(!product){
        throw {
            statusCode:404,
            message:"Product not found"
        };
    }



    const hasPurchased = await Order.findOne({
        user:userId,
        "orderItems.product":productId,
        orderStatus:"delivered"
    });


    if(!hasPurchased){

        throw {
            statusCode:403,
            message:"You can only review products you have purchased"
        };

    }



    const alreadyReviewed = await Review.findOne({
        user:userId,
        product:productId
    });


    if(alreadyReviewed){

        throw {
            statusCode:400,
            message:"You have already reviewed this product"
        };

    }



    const review = await Review.create({

        user:userId,
        product:productId,
        rating,
        comment

    });



    await updateProductRating(productId);



    return await review.populate(
        "user",
        "name avatar"
    );

};




// Update Review

export const updateReview = async (
    reviewId,
    userId,
    {rating,comment}
)=>{


    const review = await Review.findById(reviewId);


    if(!review){

        throw {
            statusCode:404,
            message:"Review not found"
        };

    }



    if(review.user.toString() !== userId.toString()){

        throw {
            statusCode:403,
            message:"Access denied"
        };

    }



    review.rating = rating ?? review.rating;

    review.comment = comment ?? review.comment;


    await review.save();



    await updateProductRating(review.product);



    return review;

};




// Delete Review

export const deleteReview = async (
    reviewId,
    user
)=>{


    const review = await Review.findById(reviewId);


    if(!review){

        throw {
            statusCode:404,
            message:"Review not found"
        };

    }



    if(
        user.role !== "admin" &&
        review.user.toString() !== user._id.toString()
    ){

        throw {
            statusCode:403,
            message:"Access denied"
        };

    }



    const productId = review.product;


    await review.deleteOne();



    await updateProductRating(productId);

};





// Common rating calculation function

const updateProductRating = async(productId)=>{


    const reviews = await Review.find({
        product:productId
    });


    const totalReviews = reviews.length;


    const averageRating = totalReviews === 0
        ? 0
        : reviews.reduce(
            (sum,item)=>sum + item.rating,
            0
        ) / totalReviews;



    await Product.findByIdAndUpdate(
        productId,
        {
            rating:averageRating,
            numReviews:totalReviews
        }
    );

};