import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { CartContext } from "../context/CartContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, loginGoogle } = useContext(CartContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (res && res.success) {
      if (res.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    }
  };

  useEffect(() => {
    const initializeGoogleSignIn = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: "533027319161-lio6ph1334up5u96u1cahnrvpntgehc3.apps.googleusercontent.com",
          callback: async (response) => {
            const res = await loginGoogle(response.credential);
            if (res && res.success) {
              navigate("/");
            }
          }
        });
        window.google.accounts.id.renderButton(
          document.getElementById("google-signin-btn"),
          { 
            theme: "outline", 
            size: "large", 
            width: "384", 
            text: "continue_with",
            shape: "rectangular"
          }
        );
      }
    };

    if (window.google) {
      initializeGoogleSignIn();
    } else {
      const interval = setInterval(() => {
        if (window.google) {
          initializeGoogleSignIn();
          clearInterval(interval);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [loginGoogle, navigate]);

  return (
    <>
      <Navbar />

      <div className="flex-grow flex items-center justify-center px-6 py-16" style={{ background: '#FAFAF8' }}>
        <div className="rounded-3xl p-8 max-w-md w-full" style={{ background: '#FFFFFF', border: '1px solid #EDE5D8', boxShadow: '0 8px 40px rgba(139,107,68,0.10)' }}>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black tracking-tight" style={{ color: '#2C2416' }}>
              Welcome Back
            </h1>
            <p className="text-sm font-medium mt-2" style={{ color: '#A08B70' }}>
              Don't have an account?{" "}
              <Link to="/register" className="font-bold hover:underline" style={{ color: '#8B6914' }}>
                Register
              </Link>
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <Input
              type="email"
              label="Email Address"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              type="password"
              label="Password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {/* FORGOT PASSWORD LINK */}
            <div className="flex justify-end -mt-1">
              <Link
                to="/forgot-password"
                className="text-xs font-semibold hover:underline transition-colors"
                style={{ color: '#8B6914' }}
              >
                Forgot Password?
              </Link>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                className="w-full py-3 text-sm tracking-wider uppercase font-bold"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </div>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="px-2 font-semibold" style={{ background: '#FFFFFF', color: '#A08B70' }}>Or continue with</span>
            </div>
          </div>

          <div className="flex justify-center">
            <div id="google-signin-btn" className="w-full flex justify-center"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;