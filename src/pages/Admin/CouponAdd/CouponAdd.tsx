import React, { useState } from "react";
import "./CouponAdd.scss";
import DashboardAdmin from "../../../components/DashboardAdmin/DashboardAdmin";
import { createDiscount, DiscountCreatePayload } from "../../../services/couponService";
import { useNavigate } from "react-router-dom";

const parseDate = (ddmmyyyy: string): string => {
  const [d, m, y] = ddmmyyyy.split("-");
  return `${y}-${m}-${d}`;
};

const CouponAdd: React.FC = () => {
  const [code, setCode] = useState("");
  const [quantity, setQuantity] = useState("");
  const [discountValue, setDiscountValue] = useState("");
  const [validFrom, setValidFrom] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [statusEnum, setStatusEnum] = useState<0 | 1 | 2>(0);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: DiscountCreatePayload = {
      code,
      discount_percentage: discountValue,
      quantity: Number(quantity),
      valid_from: parseDate(validFrom),
      valid_until: parseDate(validUntil),
      status_enum: statusEnum,
    };
    try {
      await createDiscount(payload);
      navigate("/admin-coupon-list");
    } catch (err) {
      console.error(err);
      alert("Error creating coupon");
    }
  };

  return (
    <div className="admin-layout">
      <DashboardAdmin />
      <div className="coupon-add">
        <h2>COUPONS ADD</h2>
        <form className="form-container" onSubmit={handleSubmit}>
          <div className="left-column">
            <div className="card">
              <h4>Coupon Status</h4>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="status"
                    value="0"
                    checked={statusEnum === 0}
                    onChange={() => setStatusEnum(0)}
                  />{" "}
                  Active
                </label>
                <label>
                  <input
                    type="radio"
                    name="status"
                    value="1"
                    checked={statusEnum === 1}
                    onChange={() => setStatusEnum(1)}
                  />{" "}
                  In Active
                </label>
              </div>
            </div>
            <div className="card">
              <h4>Date Schedule</h4>
              <label>Start Date</label>
              <input
                type="text"
                placeholder="dd-mm-yyyy"
                value={validFrom}
                onChange={(e) => setValidFrom(e.target.value)}
                required
              />
              <label>End Date</label>
              <input
                type="text"
                placeholder="dd-mm-yyyy"
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="right-column">
            <div className="card">
              <h4>Coupon Information</h4>
              <div className="input-group">
                <div>
                  <label>Coupons Code</label>
                  <input
                    type="text"
                    placeholder="Code enter"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label>Coupons Limits</label>
                  <input
                    type="text"
                    placeholder="limits"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                  />
                </div>
              </div>
              <label>Discount Value</label>
              <input
                type="text"
                placeholder="value enter"
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                required
              />
              <button type="submit" className="create-btn">
                Create Coupon
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CouponAdd;
