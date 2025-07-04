import React, { useState } from 'react';
import './Signup.scss';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { register } from '../../services/authService';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    full_name:'',
    password: '',
    confirmPassword: '',
    agreed: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.agreed) {
      alert('Bạn phải đồng ý với điều khoản.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert('Mật khẩu xác nhận không khớp.');
      return;
    }

    try {
      const res = await register({
        username: formData.name,
        email: formData.email,
        password: formData.password,
        full_name: formData.full_name,
      });

      console.log("Đăng ký thành công:", res);
      navigate("/");
    } catch (error: any) {
      console.error("Lỗi khi đăng ký:", error.response?.data?.detail || error.message);
      alert("Đăng ký thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-tabs">
          <button onClick={() => navigate("/login")}>Sign In</button>
          <button className="active">Sign Up</button>
        </div>
        <form className="signup-form" onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Username" onChange={handleChange} required />
          <input type="text" name="full_name" placeholder="Full Name" onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email Address" onChange={handleChange} required />

          <div className="signup-password-input-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
            />
            <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </span>
          </div>

          <div className="signup-password-input-wrapper">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="Confirm Password"
              onChange={handleChange}
              required
            />
            <span className="toggle-password" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
            </span>
          </div>

          <label className="checkbox-label">
            <input type="checkbox" name="agreed" onChange={handleChange} />
            <span>
              Are you agree to Clicon <a href="#">Terms of Condition</a> and <a href="#">Privacy Policy</a>.
            </span>
          </label>
          <button className="signup-button" type="submit">SIGN UP →</button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
