import React, { useState, useEffect, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './CouponEdit.scss';
import DashboardAdmin from '../../../components/DashboardAdmin/DashboardAdmin';
import { getCouponById, updateCoupon, Coupon } from '../../../services/couponService';

const CouponEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [form, setForm] = useState({
    code: '',
    quantity: 0,
    valid_from: '',
    valid_until: '',
    discount_percentage: '',
    is_active: false,
  });

  useEffect(() => {
    if (id) {
      getCouponById(Number(id))
        .then(data => {
          setCoupon(data);
          setForm({
            code: data.code,
            quantity: data.quantity,
            valid_from: data.valid_from,
            valid_until: data.valid_until,
            discount_percentage: data.discount_percentage,
            is_active: data.is_active,
          });
        })
        .catch(err => console.error('Error loading coupon:', err));
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    let newValue: any;
    if (type === 'checkbox') {
      newValue = checked;
    } else if (type === 'radio' && name === 'is_active') {
      newValue = value === 'true';
    } else if (name === 'quantity') {
      newValue = Number(value);
    } else {
      newValue = value;
    }
    setForm(prev => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!coupon) return;
    try {
      await updateCoupon(coupon.id, {
        code: form.code,
        quantity: form.quantity,
        valid_from: form.valid_from,
        valid_until: form.valid_until,
        discount_percentage: form.discount_percentage,
        is_active: form.is_active,
      });
      alert('Cập nhật coupon thành công!');
      navigate(`/admin-coupon-edit/${coupon.id}`);
    } catch (error) {
      console.error('Update failed:', error);
      alert('Cập nhật thất bại.');
    }
  };

  return (
    <div className="admin-layout">
      <DashboardAdmin />
      <div className="coupon-add">
        <h2>EDIT COUPON</h2>
        <form className="form-container" onSubmit={handleSubmit}>
          <div className="left-column">
            <div className="card">
              <h4>Coupon Status</h4>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="is_active"
                    value="true"
                    checked={form.is_active === true}
                    onChange={handleChange}
                  /> Active
                </label>
                <label>
                  <input
                    type="radio"
                    name="is_active"
                    value="false"
                    checked={form.is_active === false}
                    onChange={handleChange}
                  /> Inactive
                </label>
              </div>
            </div>
            <div className="card">
              <h4>Date Schedule</h4>
              <label>Start Date</label>
              <input
                type="date"
                name="valid_from"
                value={form.valid_from}
                onChange={handleChange}
              />
              <label>End Date</label>
              <input
                type="date"
                name="valid_until"
                value={form.valid_until}
                onChange={handleChange}
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
                    name="code"
                    value={form.code}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label>Coupons Limits</label>
                  <input
                    type="number"
                    name="quantity"
                    value={form.quantity}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <label>Discount Value (%)</label>
              <input
                type="text"
                name="discount_percentage"
                value={form.discount_percentage}
                onChange={handleChange}
                required
              />
              <button type="submit" className="update-btn">
                Update Coupon
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CouponEdit;
