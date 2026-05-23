import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Sun, Moon } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { getThemeColors } from "../data/themeColors";
import api from "@/api/axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const c = getThemeColors(isDark);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    const res = await api.post("/auth/login", {
      email,
      password,
    });

    const user = res.data.user;
    const token = res.data.token;

    // 1. Store first
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    // 2. Update context
    login({
      token,
      name: user.name,
      email: user.email,
    });

    // 3. THEN navigate
    navigate("/", { replace: true });

  } catch (err: any) {
    alert(err.response?.data?.message || "Login failed");
  } finally {
    setLoading(false);
  }
};

  const inputStyle: React.CSSProperties = {
    backgroundColor: c.inputBg,
    border: `1px solid ${c.border}`,
    color: c.textPrimary,
    borderRadius: "6px",
    padding: "10px 12px",
    width: "100%",
    outline: "none",
    fontSize: "14px",
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = c.accent;
  };
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = c.border;
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative"
      style={{ backgroundColor: c.appBg }}
    >
      {/* Theme toggle in corner */}
      <button
        onClick={toggleTheme}
        title={isDark ? "Switch to light mode" : "Switch to dark mode"}
        className="absolute top-5 right-5 w-9 h-9 rounded-full flex items-center justify-center"
        style={{
          backgroundColor: isDark ? "#282E33" : "#F5F7FA",
          border: `1px solid ${c.border}`,
          color: isDark ? "#F5CD47" : "#2563EB",
        }}
      >
        {isDark ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      <div
        className="w-full max-w-md mx-4"
        style={{
          backgroundColor: c.cardBg,
          border: `1px solid ${c.border}`,
          borderRadius: "12px",
          padding: "48px",
        }}
      >
        {/* Logo */}
        <div className="text-center mb-2">
          <span className="text-2xl font-bold" style={{ color: c.accent }}>
            ⚡ SalesFlow
          </span>
        </div>
        <p
          className="text-center mb-8"
          style={{ color: c.textSecondary, fontSize: "13px" }}
        >
          Sign in to your CRM workspace
        </p>

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-4">
            <label
              className="block mb-1.5"
              style={{ fontSize: "12px", color: c.textSecondary }}
            >
              Email
            </label>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              style={inputStyle}
              onFocus={handleFocus}
              onBlur={handleBlur}
              required
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label
              className="block mb-1.5"
              style={{ fontSize: "12px", color: c.textSecondary }}
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                style={{ ...inputStyle, paddingRight: "40px" }}
                onFocus={handleFocus}
                onBlur={handleBlur}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: c.textSecondary }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2.5 rounded-md text-sm font-medium" disabled={loading}
            style={{ backgroundColor: c.buttonBg, color: "#FFFFFF", height: "40px" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = c.buttonHover)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = c.buttonBg)}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p
          className="text-center mt-4"
          style={{ color: c.textSecondary, fontSize: "12px" }}
        >
          Use your registered account credentials
        </p>
      </div>
    </div>
  );
}
