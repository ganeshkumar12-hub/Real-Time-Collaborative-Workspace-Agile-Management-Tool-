import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import useAuthStore from "../store/authStore";
import "./Login.css";

function Login() {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error("Please enter email and password.");
      return;
    }

    setLoading(true);

    const toastId = toast.loading("Logging in...");

    try {
      await login({
        email,
        password,
      });

      toast.success("Login Successful!", {
        id: toastId,
      });

      navigate("/dashboard");
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          "Invalid email or password.",
        {
          id: toastId,
        }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <h1>Welcome Back 👋</h1>

        <p className="subtitle">
          Sign in to continue to your workspace
        </p>

        <form onSubmit={submitHandler}>

          <div className="input-group">
            <Mail size={18} className="icon" />

            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">

            <Lock size={18} className="icon" />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              className="eye-btn"
              onClick={() =>
                setShowPassword(!showPassword)
              }
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>

          </div>

          <button
            className="login-btn"
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <p className="register-text">
          Don't have an account?

          <Link to="/register">
            Register
          </Link>

        </p>

      </div>
    </div>
  );
}

export default Login;