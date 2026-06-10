import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call – replace with real backend endpoint later
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <>
      <Navbar />

      <div className="flex-grow flex items-center justify-center px-6 py-16 bg-slate-50/50 min-h-[calc(100vh-64px)]">
        <div className="bg-white border border-slate-100 rounded-3xl p-8 max-w-md w-full shadow-xl shadow-slate-100/50">

          {submitted ? (
            /* ── SUCCESS STATE ── */
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">Check your email</h1>
              <p className="text-slate-400 text-sm font-medium mt-3 leading-relaxed">
                If an account exists for{" "}
                <span className="font-bold text-slate-700">{email}</span>, we've
                sent a password reset link. Please check your inbox.
              </p>
              <Link
                to="/login"
                className="mt-6 inline-block text-sm text-purple-600 font-bold hover:underline"
              >
                ← Back to Login
              </Link>
            </div>
          ) : (
            /* ── FORM STATE ── */
            <>
              <div className="text-center mb-8">
                {/* Icon */}
                <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <h1 className="text-3xl font-black text-slate-800 tracking-tight">
                  Forgot Password?
                </h1>
                <p className="text-slate-400 text-sm font-medium mt-2">
                  Enter your email and we'll send you a reset link.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                  type="email"
                  label="Email Address"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

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
                        Sending...
                      </span>
                    ) : (
                      "Send Reset Link"
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
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
