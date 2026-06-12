// import { useState } from "react";
// import { Link } from "react-router-dom";
// import Navbar from "../components/Navbar";
// import Input from "../components/ui/Input";
// import Button from "../components/ui/Button";

// const Register = () => {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleRegister = (e) => {
//     e.preventDefault();
//     alert(`Registered ${name}`);
//   };

//   return (
//     <>
//       <Navbar />

//       <div className="flex-grow flex items-center justify-center px-6 py-16 bg-slate-50/50">
//         <div className="bg-white border border-slate-100 rounded-3xl p-8 max-w-md w-full shadow-xl shadow-slate-100/50">
//           <div className="text-center mb-8">
//             <h1 className="text-3xl font-black text-slate-800 tracking-tight">
//               Create Account
//             </h1>
//             <p className="text-slate-400 text-sm font-medium mt-2">
//               Already have an account?{" "}
//               <Link to="/login" className="text-purple-600 font-bold hover:underline">
//                 Login
//               </Link>
//             </p>
//           </div>

//           <form onSubmit={handleRegister} className="space-y-5">
//             <Input
//               type="text"
//               label="Name"
//               placeholder="Allan Wikkins"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               required
//             />

//             <Input
//               type="email"
//               label="Email Address"
//               placeholder="you@example.com"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />

//             <Input
//               type="password"
//               label="Password"
//               placeholder="••••••••"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />

//             <div className="flex flex-col text-left [&_input]:bg-slate-50 [&_input]:text-slate-900 [&_input]:border-slate-200 [&_input]:placeholder-slate-400">
//               <Input
//                 type="password"
//                 label="Confirm Password"
//                 placeholder="••••••••"
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//                 required
//               />
//             </div>

//             <div className="pt-2">
//               <Button
//                 type="submit"
//                 variant="primary"
//                 className="w-full py-3 text-sm tracking-wider uppercase font-bold"
//               >
//                 Register
//               </Button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Register; 




import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { CartContext } from "../context/CartContext";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { register, loginGoogle } = useContext(CartContext);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setLoading(true);
    const res = await register(name, email, password, confirmPassword);
    setLoading(false);
    if (res && res.success) {
      navigate("/login");
    }
  };

  useEffect(() => {
    const initializeGoogleSignUp = () => {
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
          document.getElementById("google-signup-btn"),
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
      initializeGoogleSignUp();
    } else {
      const interval = setInterval(() => {
        if (window.google) {
          initializeGoogleSignUp();
          clearInterval(interval);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [loginGoogle, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-[#0b1329]">
      <Navbar />

      <div className="flex-grow flex items-center justify-center px-6 py-16">
        <div className="bg-white border border-slate-100 rounded-3xl p-8 max-w-md w-full shadow-xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">
              Create Account
            </h1>
            <p className="text-slate-400 text-sm font-medium mt-2">
              Already have an account?{" "}
              <Link to="/login" className="text-purple-600 font-bold hover:underline">
                Login
              </Link>
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            <div className="flex flex-col text-left [&_input]:bg-slate-50 [&_input]:text-slate-900 [&_input]:border-slate-200 [&_input]:placeholder-slate-400">
              <Input
                type="text"
                label="Name"
                placeholder="Allan Wikkins"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col text-left [&_input]:bg-slate-50 [&_input]:text-slate-900 [&_input]:border-slate-200 [&_input]:placeholder-slate-400">
              <Input
                type="email"
                label="Email Address"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col text-left [&_input]:bg-slate-50 [&_input]:text-slate-900 [&_input]:border-slate-200 [&_input]:placeholder-slate-400">
              <Input
                type="password"
                label="Password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col text-left [&_input]:bg-slate-50 [&_input]:text-slate-900 [&_input]:border-slate-200 [&_input]:placeholder-slate-400">
              <Input
                type="password"
                label="Confirm Password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                className="w-full py-3 text-sm tracking-wider uppercase font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-md rounded-xl transition-colors"
                disabled={loading}
              >
                {loading ? "Registering..." : "Register"}
              </Button>
            </div>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-400 font-semibold">Or continue with</span>
            </div>
          </div>

          <div className="flex justify-center">
            <div id="google-signup-btn" className="w-full flex justify-center"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;