import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuthStore from "../store/authStore";

function Register() {
  const register = useAuthStore((state) => state.register);

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await register({
        name,
        email,
        password,
      });

      navigate("/dashboard");
    } catch (error) {
      alert("Registration Failed");
    }
  };

  return (
    <div>
      <h1>Register</h1>

      <form onSubmit={submitHandler}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
        />

        <br />
        <br />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <br />
        <br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <br />
        <br />

        <button type="submit">
          Register
        </button>
      </form>

      <div
        style={{
          textAlign: "center",
          marginTop: "20px",
        }}
      >
        <span style={{ color: "#94a3b8" }}>
          Already have an account?
        </span>

        <Link
          to="/"
          style={{
            marginLeft: "6px",
            color: "#60a5fa",
            fontWeight: "600",
            textDecoration: "none",
          }}
        >
          Login
        </Link>
      </div>
    </div>
  );
}

export default Register;