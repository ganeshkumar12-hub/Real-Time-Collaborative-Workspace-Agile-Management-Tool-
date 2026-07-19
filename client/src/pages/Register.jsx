import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import useAuthStore from "../store/authStore";
import "./Register.css";

function Register() {
  const register = useAuthStore((state) => state.register);

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }

    setLoading(true);

    const toastId = toast.loading("Creating account...");

    try {
      await register({
        name,
        email,
        password,
      });

      toast.success("Registration Successful!", {
        id: toastId,
      });

      navigate("/dashboard");
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          "Registration failed.",
        {
          id: toastId,
        }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">

        <h1>Create Account 🚀</h1>

        <p className="subtitle">
          Create your workspace account
        </p>

        <form onSubmit={submitHandler}>

          <div className="input-group">
            <User size={18} className="icon" />

            <input
              type="text"
              placeholder="Enter Name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />
          </div>

          <div className="input-group">
            <Mail size={18} className="icon" />

            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />
          </div>

          <div className="input-group">
            <Lock size={18} className="icon" />

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="Enter Password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
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
            className="register-btn"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "Register"}
          </button>

        </form>

        <p className="login-text">
          Already have an account?

          <Link to="/">
            Login
          </Link>

        </p>

      </div>
    </div>
  );
}

export default Register;