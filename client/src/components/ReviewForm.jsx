import { useState } from "react";
import { reviewApi } from "../services/api";

function ReviewForm({ productId }) {

    const [rating,setRating]=useState(5);
    const [comment,setComment]=useState("");

    const submitReview=async()=>{

        try{

            await reviewApi.create(productId,{
                rating,
                comment
            });

            alert("Review submitted!");

        }catch(err){

            alert(err.response?.data?.message);

        }

    }

    return(

        <div className="review-box">

            <h4>Write Review</h4>

            <select
                value={rating}
                onChange={(e)=>setRating(Number(e.target.value))}
            >

                <option value={5}>★★★★★</option>
                <option value={4}>★★★★☆</option>
                <option value={3}>★★★☆☆</option>
                <option value={2}>★★☆☆☆</option>
                <option value={1}>★☆☆☆☆</option>

            </select>

            <textarea
                value={comment}
                onChange={(e)=>setComment(e.target.value)}
                placeholder="Write your review"
            />

            <button
                className="primary-btn"
                onClick={submitReview}
            >
                Submit Review
            </button>

        </div>

    )

}

export default ReviewForm;