import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "./Login.scss";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ email, password });
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="tabs">
          <button className="active">Sign In</button>
          <button onClick={() => navigate("/signup")}>Sign Up</button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <label>Email Address</label>
          <input
            type="email"
            value={email}
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="password-label">
            Password
            <a href="/forgot-password">Forget Password?</a>
          </label>
          <div className="login-password-input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </span>
          </div>

          <button type="submit" className="sign-in-btn">SIGN IN →</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
