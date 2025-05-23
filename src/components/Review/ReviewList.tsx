import { FC, useEffect, useState } from "react";
import axios from "axios";
import ReviewItem from "./ReviewItem";

interface Review {
  id: number;
  avatar: string;
  name: string;
  time: string;
  rating: number;
  comment: string;
}

const ReviewList: FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    axios.get("/api/reviews") // đổi endpoint theo API của bạn
      .then((res) => setReviews(res.data))
      .catch((err) => console.error("Error loading reviews:", err));
  }, []);

  return (
    <div>
      {reviews.map((review) => (
        <ReviewItem key={review.id} {...review} />
      ))}
    </div>
  );
};

export default ReviewList;
