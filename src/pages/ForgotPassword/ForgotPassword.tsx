import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./ForgotPassword.scss";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Sending code to:", email);
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-box">
        <h2 className="title">Forget Password</h2>
        <p className="description">
          Enter the email address or mobile phone number associated with your Clicon account.
        </p>

        <form onSubmit={handleSubmit} className="form">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button type="submit">SEND CODE →</button>
        </form>

        <div className="bottom-links">
          <p>
            Already have account? <Link to="/login">Sign In</Link>
          </p>
          <p>
            Don’t have account? <Link to="/signup">Sign Up</Link>
          </p>
        </div>

        <p className="help-text">
          You may contact <Link to="/support">Customer Service</Link> for help restoring access to your account.
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
