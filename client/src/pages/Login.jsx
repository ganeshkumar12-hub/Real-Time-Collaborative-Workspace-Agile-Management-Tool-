import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuthStore from "../store/authStore";

function Login() {
  const login = useAuthStore((state) => state.login);

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await login({
        email,
        password,
      });

      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      alert("Login Failed");
    }
  };

  return (
    <div>
      <h1>Login</h1>

      <form onSubmit={submitHandler}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <br />
        <br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <br />
        <br />

        <button type="submit">
          Login
        </button>
      </form>

      <p
        style={{
          marginTop: "15px",
          textAlign: "center",
          color: "#94a3b8",
          fontSize: "14px",
        }}
      >
        Don't have an account?{" "}
        <Link
          to="/register"
          style={{
            color: "#3b82f6",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          Register here
        </Link>
      </p>
    </div>
  );
}

export default Login;