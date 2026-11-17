import { useState } from "react";

const API_URL = "https://jobtrack-pxfd.onrender.com/api/auth";

export default function Auth({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const endpoint = isLogin ? "/login" : "/register";

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong.");
      }

      onAuthSuccess(data);
    } catch (err) {
      setError(err.message || "Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  const styles = {
    page: {
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#f4f5fb",
      padding: "24px",
      fontFamily: "Arial, sans-serif",
    },
    card: {
      width: "100%",
      maxWidth: "430px",
      background: "#ffffff",
      padding: "38px",
      borderRadius: "16px",
      boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
    },
    logo: {
      fontSize: "28px",
      fontWeight: "bold",
      color: "#5b4bdb",
      marginBottom: "8px",
    },
    heading: {
      fontSize: "25px",
      color: "#171725",
      marginBottom: "8px",
    },
    description: {
      color: "#77778a",
      marginBottom: "28px",
      lineHeight: 1.5,
    },
    label: {
      display: "block",
      fontSize: "14px",
      fontWeight: "600",
      marginBottom: "8px",
      color: "#333344",
    },
    input: {
      width: "100%",
      padding: "13px",
      border: "1px solid #dedee8",
      borderRadius: "8px",
      marginBottom: "19px",
      fontSize: "15px",
      boxSizing: "border-box",
      outlineColor: "#5b4bdb",
    },
    button: {
      width: "100%",
      padding: "14px",
      border: "none",
      borderRadius: "8px",
      background: "#5b4bdb",
      color: "white",
      fontSize: "16px",
      fontWeight: "bold",
      cursor: "pointer",
    },
    switch: {
      textAlign: "center",
      marginTop: "24px",
      color: "#77778a",
      fontSize: "14px",
    },
    link: {
      border: "none",
      background: "none",
      color: "#5b4bdb",
      fontWeight: "bold",
      cursor: "pointer",
      fontSize: "14px",
    },
    error: {
      color: "#dc2626",
      background: "#fee2e2",
      padding: "12px",
      borderRadius: "8px",
      marginBottom: "18px",
      fontSize: "14px",
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>JobTrack.</div>

        <h1 style={styles.heading}>
          {isLogin ? "Welcome back!" : "Create your account"}
        </h1>

        <p style={styles.description}>
          {isLogin
            ? "Log in to manage your job applications."
            : "Join JobTrack and organize your career journey."}
        </p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <label style={styles.label}>Full Name</label>
              <input
                style={styles.input}
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </>
          )}

          <label style={styles.label}>Email Address</label>
          <input
            style={styles.input}
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label style={styles.label}>Password</label>
          <input
            style={styles.input}
            type="password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            required
          />

          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? "Please wait..." : isLogin ? "Log In" : "Create Account"}
          </button>
        </form>

        <div style={styles.switch}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}

          <button
            style={styles.link}
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
          >
            {isLogin ? "Sign Up" : "Log In"}
          </button>
        </div>
      </div>
    </div>
  );
}
