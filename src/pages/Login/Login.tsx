import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "./Login.scss";
import { login } from "../../services/authService";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = await login({ usernameOrEmail: email, password });

      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.dispatchEvent(new Event("storage"));

      navigate("/");
    } catch (err: any) {
      const message =
        err.response?.data?.detail || "Đã xảy ra lỗi trong quá trình đăng nhập";
      setErrorMessage(message);
    }
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
            type="text"
            value={email}
            placeholder="Username or Email"
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

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <button type="submit" className="sign-in-btn">SIGN IN →</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
