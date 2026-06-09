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




import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // Added state

  const handleRegister = (e) => {
    e.preventDefault();

    // Validation: Check if passwords match
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    alert(`Registered ${name}`);
  };

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

            {/* Added Confirm Password Input Field */}
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
              >
                Register
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;