import { FC } from "react";
import { StarFilled } from "@ant-design/icons";
import "./ReviewItem.scss";

interface ReviewItemProps {
  avatar: string;
  name: string;
  time: string;
  rating: number;
  comment: string;
}

const ReviewItem: FC<ReviewItemProps> = ({ avatar, name, time, rating, comment }) => {
  return (
    <div className="review-item">
      <div className="review-header">
        <img src={avatar} alt={name} className="avatar" />
        <div>
          <div className="name-time">
            <span className="name">{name}</span>
            <span className="dot">•</span>
            <span className="time">{time}</span>
          </div>
          <div className="stars">
            {[...Array(rating)].map((_, i) => (
              <StarFilled key={i} style={{ color: "#FF9017", fontSize: 16 }} />
            ))}
          </div>
        </div>
      </div>
      <p className="review-comment">{comment}</p>
    </div>
  );
};

export default ReviewItem;
