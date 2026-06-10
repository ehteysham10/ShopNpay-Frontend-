import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);
    // Simulate API call – replace with real backend endpoint later
    // e.g. POST /api/v1/auth/reset-password/:token { password }
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);

    // Redirect to login after successful reset
    navigate("/login");
  };

  return (
    <>
      <Navbar />

      <div className="flex-grow flex items-center justify-center px-6 py-16 bg-slate-50/50 min-h-[calc(100vh-64px)]">
        <div className="bg-white border border-slate-100 rounded-3xl p-8 max-w-md w-full shadow-xl shadow-slate-100/50">

          {/* HEADER */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">
              Set New Password
            </h1>
            <p className="text-slate-400 text-sm font-medium mt-2">
              Create a strong password for your account.
            </p>
          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs font-semibold px-4 py-3 rounded-xl mb-5 text-center">
              {error}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              type="password"
              label="New Password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Input
              type="password"
              label="Confirm Password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            {/* PASSWORD STRENGTH HINTS */}
            <div className="text-xs text-slate-400 font-medium space-y-1 -mt-2">
              <div className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${password.length >= 6 ? "bg-green-400" : "bg-slate-300"}`} />
                At least 6 characters
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${password && password === confirmPassword ? "bg-green-400" : "bg-slate-300"}`} />
                Passwords match
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                className="w-full py-3 text-sm tracking-wider uppercase font-bold"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Resetting...
                  </span>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </div>
          </form>

          <p className="text-center text-xs text-slate-400 font-medium mt-6">
            Remember your password?{" "}
            <Link to="/login" className="text-purple-600 font-bold hover:underline">
              Login
            </Link>
          </p>

        </div>
      </div>
    </>
  );
};

export default ResetPassword;
