import React, { useEffect, useState } from "react";
import "./CouponList.scss";
import DashboardAdmin from "../../../components/DashboardAdmin/DashboardAdmin";
import { FaTrash } from "react-icons/fa";
import {
  getDiscounts,
  deleteDiscount,
  Discount,
  PaginatedDiscounts,
} from "../../../services/couponService";
import { useNavigate } from "react-router-dom";

const formatDate = (iso: string) => {
  const [year, month, day] = iso.split("-");
  return `${day}-${month}-${year}`;
};

const CouponList: React.FC = () => {
  const navigate = useNavigate();
  const [coupons, setCoupons] = useState<Discount[]>([]);
  const [allCoupons, setAllCoupons] = useState<Discount[]>([]);
  const [meta, setMeta] = useState<PaginatedDiscounts["meta"] | null>(null);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const couponsPerPage = 8;

  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        const { data, meta } = await getDiscounts(
          currentPage,
          couponsPerPage
        );
        setCoupons(data);
        setMeta(meta);
      } catch (err) {
        console.error("Error fetching coupons:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [currentPage]);

  useEffect(() => {
    // 2) Load "all pages", gom về allCoupons
    if (!meta) return;
    (async () => {
      let page = 1;
      const perPage = couponsPerPage;
      let aggregated: Discount[] = [];

      // Lặp từ page 1 -> last_page
      while (page <= meta.last_page) {
        const { data } = await getDiscounts(page, perPage);
        aggregated = aggregated.concat(data);
        page++;
      }

      setAllCoupons(aggregated);
    })();
  }, [meta]);

  const totalPages = meta ? meta.last_page : 1;

  // tính số lượng cho promo cards
  const smallCount = allCoupons.filter(c => +c.discount_percentage < 10).length;
  const mediumCount = allCoupons.filter(c => {
    const p = +c.discount_percentage;
    return p >= 10 && p < 30;
  }).length;
  const largeCount = allCoupons.filter(c => +c.discount_percentage >= 30).length;

  const handleDelete = async (id: number) => {
    if (
      window.confirm(`Are you sure you want to delete coupon #${id}?`)
    ) {
      try {
        await deleteDiscount(id);
        // xoá khỏi state để UI cập nhật
        setCoupons((prev) => prev.filter((c) => c.id !== id));
      } catch (err) {
        console.error("Delete failed:", err);
        alert("Failed to delete coupon");
      }
    }
  };

  return (
    <div className="admin-layout">
      <DashboardAdmin />
      <div className="coupon-list">
        <h2>COUPONS LIST</h2>

        <div className="coupon-promotions">
          <div className="promo-card light-orange">
            <h4>{smallCount} Coupons</h4>
            <p>Small nice coupons pack</p>
            <button
              className="btn-orange"
              onClick={() => navigate("/admin-coupon-add")}
            >
              Create Now
            </button>
          </div>

          <div className="promo-card light-blue">
            <h4>{mediumCount} Coupons</h4>
            <p>Medium nice coupons pack</p>
            <button
              className="btn-green"
              onClick={() => navigate("/admin-coupon-add")}
            >
              Create Now
            </button>
          </div>

          <div className="promo-card full-orange">
            <h4>{largeCount} Coupons</h4>
            <p>High nice coupons pack</p>
            <button
              className="btn-orange"
              onClick={() => navigate("/admin-coupon-add")}
            >
              Create Now
            </button>
            <div className="graphic" />
          </div>
        </div>

        <div className="coupon-table-container">
          {loading ? (
            <p>Loading coupons...</p>
          ) : (
            <>
              <table className="coupon-table">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Status</th>
                    <th>Discount Value</th>
                    <th>Limit</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((coupon) => (
                    <tr key={coupon.id}>
                      <td className="code">{coupon.code}</td>
                      <td>
                        <span
                          className={`status ${
                            coupon.is_active ? "active" : "inactive"
                          }`}
                        >
                          {coupon.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>{coupon.discount_percentage}%</td>
                      <td>{coupon.quantity}</td>
                      <td>{formatDate(coupon.valid_from)}</td>
                      <td>{formatDate(coupon.valid_until)}</td>
                      <td className="remove-btn">
                        <FaTrash
                          className="action-delete"
                          style={{ cursor: "pointer" }}
                          onClick={() => handleDelete(coupon.id)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="pagination">
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.max(1, p - 1))
                  }
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    className={currentPage === i + 1 ? "active" : ""}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CouponList;
