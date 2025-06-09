// src/pages/Admin/Review/Review.tsx
import React, { useEffect, useState } from "react";
import "./Review.scss";
import DashboardAdmin from "../../../components/DashboardAdmin/DashboardAdmin";
import { FaStar } from "react-icons/fa";
import { getReviews, Review as ReviewType, PaginatedReviews } from "../../../services/reviewService";
import { getSubproducts, Subproduct } from "../../../services/subproductService";

const Review: React.FC = () => {
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [subproducts, setSubproducts] = useState<Subproduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalReviews, setTotalReviews] = useState(0);

  // dữ liệu cho hai bảng
  const [bestList, setBestList] = useState<
    { sub: Subproduct; avg: number; count: number }[]
  >([]);
  const [worstList, setWorstList] = useState<
    { sub: Subproduct; avg: number; count: number }[]
  >([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        // 1) fetch reviews (lần 1 để lấy tổng count)
        const firstPage = await getReviews(1, 1);
        const allCount = firstPage.meta.total;
        setTotalReviews(allCount);

        // 2) fetch tất cả reviews
        const allReviews = await getReviews(1, allCount);
        setReviews(allReviews.data);

        // 3) fetch subproducts
        const subs = await getSubproducts();
        setSubproducts(subs);

        // 4) tính avg rating & count theo sub_product
        const grouped: Record<number, { sum: number; count: number }> = {};
        allReviews.data.forEach((r) => {
          if (!grouped[r.sub_product]) grouped[r.sub_product] = { sum: 0, count: 0 };
          grouped[r.sub_product].sum += r.rating;
          grouped[r.sub_product].count += 1;
        });

        const stats = Object.entries(grouped)
          .map(([subId, { sum, count }]) => ({
            id: Number(subId),
            avg: sum / count,
            count,
          }))
          .filter((s) => s.count > 0);

        // 5) kết hợp với subproducts để có đầy đủ image + name
        const withSub = stats
          .map((s) => {
            const sub = subs.find((x) => x.id === s.id);
            return sub ? { sub, avg: s.avg, count: s.count } : null;
          })
          .filter((x): x is { sub: Subproduct; avg: number; count: number } => !!x);

        // 6) sort & lấy top 10
        const best = [...withSub].sort((a, b) => b.avg - a.avg).slice(0, 10);
        const worst = [...withSub].sort((a, b) => a.avg - b.avg).slice(0, 10);

        setBestList(best);
        setWorstList(worst);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // phần summary hiện có...
  // tính avgRating cho summary
  const avgRating =
    reviews.reduce((sum, r) => sum + r.rating, 0) / (reviews.length || 1);

  // tính % cho biểu đồ bar...
  const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  reviews.forEach((r) => {
    if (counts[r.rating] !== undefined) counts[r.rating]++;
  });
  const ratingBars = [5, 4, 3, 2, 1].map((star) => ({
    label: `${star} star`,
    value: Math.round((counts[star] / (reviews.length || 1)) * 100),
  }));

  if (loading) {
    return (
      <div className="admin-layout">
        <DashboardAdmin />
        <div className="review-page">
          <h2>SHOP REVIEWS</h2>
          <p>Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <DashboardAdmin />
      <div className="review-page">
        <h2>SHOP REVIEWS</h2>
        <div className="review-card">
          <h4>Shop Reviews</h4>

          <div className="summary">
            <div className="stars">
              {[1, 2, 3, 4, 5].map((i) => (
                <FaStar
                  key={i}
                  color={i <= Math.floor(avgRating) ? "#ffc107" : "#ffc10780"}
                />
              ))}
            </div>
            <div className="score">
              {avgRating.toFixed(1)} Out
              <br />
              of 5
            </div>
          </div>

          <div className="based-on">
            Based on {totalReviews.toLocaleString()} Review
            {totalReviews > 1 ? "s" : ""}
          </div>

          <div className="bars">
            {ratingBars.map((rate, index) => (
              <div className="rating-row" key={index}>
                <span>{rate.label} :</span>
                <div className="bar">
                  <div
                    className="fill"
                    style={{ width: `${rate.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* <div className="footer">
            <a href="#">How do we calculate ratings ?</a>
          </div> */}
        </div>

        {/* --- Phần 2 bảng xếp hạng --- */}
        <div className="rankings" style={{ display: "flex", gap: "2rem", marginTop: "2rem" }}>
          {/* Best Rated */}
          <div className="ranking-table" style={{ flex: 1 }}>
            <h4>Top 10 Best Rated</h4>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Reviews</th>
                </tr>
              </thead>
              <tbody>
                {bestList.map(({ sub, count }) => (
                  <tr key={sub.id}>
                    <td>{sub.id}</td>
                    <td>
                      <img
                        src={sub.product.image}
                        alt={sub.product.name}
                        style={{ width: 40, height: 40, objectFit: "cover" }}
                      />
                    </td>
                    <td>{sub.product.name}</td>
                    <td>{count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Worst Rated */}
          <div className="ranking-table" style={{ flex: 1 }}>
            <h4>Top 10 Worst Rated</h4>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Reviews</th>
                </tr>
              </thead>
              <tbody>
                {worstList.map(({ sub, count }) => (
                  <tr key={sub.id}>
                    <td>{sub.id}</td>
                    <td>
                      <img
                        src={sub.product.image}
                        alt={sub.product.name}
                        style={{ width: 40, height: 40, objectFit: "cover" }}
                      />
                    </td>
                    <td>{sub.product.name}</td>
                    <td>{count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Review;
