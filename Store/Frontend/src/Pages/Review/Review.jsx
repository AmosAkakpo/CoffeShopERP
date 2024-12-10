import React, { useState } from "react";
import axios from "axios";
import "./Review.css";

function Review() {
  const [values, setValues] = useState({
    branch_id: "",
    review_date: "",
    star_rating: "",
    review_comment: "",
  });

  const handleChanges = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3000/review', values)
    .then((res) => {
      if (res.data.Status === "Success") {
        alert("Review submitted successfully!");
        setValues({
          branch_id: "",
          review_date: "",
          star_rating: "",
          review_comment: "",
        });
      } else {
        alert(res.data.Error || "Error occurred while submitting the review.");
      }
    })
    .catch((err) => {
      console.log(values);
      console.log(err.response.data);
      console.error("Request failed:", err);
      alert("not working.");
    });
  };

  return (
    <div className="review-wrapper">
      <h2>Submit a Review</h2>
      <form onSubmit={handleSubmit} className="review-form">
        <div className="input-box-review">
          <label htmlFor="branch_id">Branch ID</label>
          <input
            type="text"
            id="branch_id"
            name="branch_id"
            value={values.branch_id}
            onChange={handleChanges}
            placeholder="Enter Branch ID"
            required
          />
        </div>

        <div className="input-box-review">
          <label htmlFor="review_date">Review Date</label>
          <input
            type="date"
            id="review_date"
            name="review_date"
            value={values.review_date}
            onChange={handleChanges}
            required
          />
        </div>

        <div className="input-box-review">
          <label htmlFor="star_rating">Star Rating</label>
          <select
            id="star_rating"
            name="star_rating"
            value={values.star_rating}
            onChange={handleChanges}
            required
          >
            <option value="">Select Rating</option>
            {[1, 2, 3, 4, 5].map((rating) => (
              <option key={rating} value={rating}>
                {rating}
              </option>
            ))}
          </select>
        </div>

        <div className="input-box-review">
          <label htmlFor="review_comment">Review Comment</label>
          <textarea
            id="review_comment"
            name="review_comment"
            value={values.review_comment}
            onChange={handleChanges}
            placeholder="Write your review here..."
            required
          ></textarea>
        </div>

        <button type="submit" className="btn-review">
          Submit Review
        </button>
      </form>
    </div>
  );
}

export default Review;
