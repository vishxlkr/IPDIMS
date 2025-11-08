import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Loading from "../../components/Loading";

const Login = () => {
   const { token, setToken, setUserData, backendUrl, loading, setLoading } =
      useContext(AppContext);
   const navigate = useNavigate();

   const adminUrl = import.meta.env.VITE_ADMIN_URL;

   const [step, setStep] = useState("login"); // login | signup | reset | otp | newPassword
   const [purpose, setPurpose] = useState("");
   const [name, setName] = useState("");
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [confirmPassword, setConfirmPassword] = useState("");
   const [otp, setOtp] = useState("");

   // ---------- AUTH FUNCTIONS ----------
   const signup = async (name, email, password) => {
      try {
         setLoading(true);
         const { data } = await axios.post(`${backendUrl}/api/user/signup`, {
            name,
            email,
            password,
         });
         if (data.success) {
            toast.success("OTP sent to your email!");
            return { success: true };
         }
         toast.error(data.message);
         return { success: false };
      } catch (error) {
         toast.error(error.message);
         return { success: false };
      } finally {
         setLoading(false);
      }
   };

   const verifyOtp = async (email, otp) => {
      try {
         setLoading(true);
         const { data } = await axios.post(
            `${backendUrl}/api/user/verify-otp`,
            {
               email,
               otp,
            }
         );

         const tokenValue = data.token || data.user?.token;

         if (data.success && tokenValue) {
            localStorage.setItem("token", tokenValue);
            setToken(tokenValue);
            toast.success(data.message);
            return { success: true, user: data.user };
         }

         toast.error(data.message || "Verification failed");
         return { success: false };
      } catch (error) {
         toast.error(error.response?.data?.message || error.message);
         return { success: false };
      } finally {
         setLoading(false);
      }
   };

   const login = async (email, password) => {
      try {
         setLoading(true);
         const { data } = await axios.post(`${backendUrl}/api/user/login`, {
            email,
            password,
         });

         const tokenValue = data.token || data.user?.token;

         if (data.success && tokenValue) {
            localStorage.setItem("token", tokenValue);
            setToken(tokenValue);
            toast.success("Login successful!");
            return { success: true, user: data.user };
         }

         toast.error(data.message || "Login failed");
         return { success: false };
      } catch (error) {
         toast.error(error.message);
         return { success: false };
      } finally {
         setLoading(false);
      }
   };

   const forgotPassword = async (email) => {
      try {
         setLoading(true);
         const { data } = await axios.post(
            `${backendUrl}/api/user/forgot-password`,
            {
               email,
            }
         );
         if (data.success) {
            toast.success("OTP sent for password reset!");
            return { success: true };
         }
         toast.error(data.message);
         return { success: false };
      } catch (error) {
         toast.error(error.message);
         return { success: false };
      } finally {
         setLoading(false);
      }
   };

   const resetPassword = async (email, otp, newPassword) => {
      try {
         setLoading(true);
         const { data } = await axios.post(
            `${backendUrl}/api/user/reset-password`,
            {
               email,
               otp,
               newPassword,
            }
         );
         if (data.success) {
            toast.success("Password updated successfully!");
            return { success: true };
         }
         toast.error(data.message);
         return { success: false };
      } catch (error) {
         toast.error(error.message);
         return { success: false };
      } finally {
         setLoading(false);
      }
   };

   const handleSubmit = async (e) => {
      e.preventDefault();

      if (step === "signup") {
         const res = await signup(name, email, password);
         if (res.success) {
            setPurpose("signup");
            setStep("otp");
         }
      } else if (step === "login") {
         const res = await login(email, password);
         if (res.success) {
            setUserData(res.user);
            navigate("/");
         }
      } else if (step === "reset") {
         const res = await forgotPassword(email);
         if (res.success) {
            setPurpose("reset");
            setStep("otp");
         }
      } else if (step === "otp") {
         const res = await verifyOtp(email, otp);
         if (res.success) {
            if (purpose === "signup") {
               setUserData(res.user);
               navigate("/");
            } else if (purpose === "reset") {
               setStep("newPassword");
            }
         }
      } else if (step === "newPassword") {
         if (password !== confirmPassword)
            return toast.error("Passwords do not match!");
         const res = await resetPassword(email, otp, password);
         if (res.success) navigate("/login");
      }
   };

   useEffect(() => {
      if (token) navigate("/");
   }, [token]);

   return (
      <form
         onSubmit={handleSubmit}
         className="min-h-[80vh] flex items-center justify-center"
      >
         <div className="flex flex-col items-center">
            <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg relative">
               {loading && <Loading />}

               <p className="text-2xl font-semibold">
                  {step === "login"
                     ? "Login"
                     : step === "signup"
                     ? "Sign Up"
                     : step === "reset"
                     ? "Reset Password"
                     : step === "otp"
                     ? "Enter OTP"
                     : "Set New Password"}
               </p>

               {step === "signup" && (
                  <input
                     type="text"
                     placeholder="Full Name"
                     className="border p-2 w-full rounded"
                     value={name}
                     onChange={(e) => setName(e.target.value)}
                     required
                  />
               )}

               {step !== "otp" && step !== "newPassword" && (
                  <input
                     type="email"
                     placeholder="Email"
                     className="border p-2 w-full rounded"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     required
                  />
               )}

               {(step === "login" ||
                  step === "signup" ||
                  step === "newPassword") && (
                  <input
                     type="password"
                     placeholder={
                        step === "newPassword" ? "New Password" : "Password"
                     }
                     className="border p-2 w-full rounded"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     required
                  />
               )}

               {step === "newPassword" && (
                  <input
                     type="password"
                     placeholder="Confirm Password"
                     className="border p-2 w-full rounded"
                     value={confirmPassword}
                     onChange={(e) => setConfirmPassword(e.target.value)}
                     required
                  />
               )}

               {step === "otp" && (
                  <input
                     type="text"
                     placeholder="Enter OTP"
                     className="border p-2 w-full rounded"
                     value={otp}
                     onChange={(e) => setOtp(e.target.value)}
                     required
                  />
               )}

               <button
                  type="submit"
                  className="bg-primary text-white w-full py-2 rounded-md mt-2"
               >
                  {step === "login"
                     ? "Login"
                     : step === "signup"
                     ? "Sign Up"
                     : step === "reset"
                     ? "Send OTP"
                     : step === "otp"
                     ? "Verify OTP"
                     : "Save Password"}
               </button>

               <div className="w-full mt-2 text-sm">
                  {step === "login" && (
                     <>
                        <p>
                           Forgot password?{" "}
                           <span
                              onClick={() => setStep("reset")}
                              className="text-primary underline cursor-pointer"
                           >
                              Reset
                           </span>
                        </p>
                        <p>
                           New user?{" "}
                           <span
                              onClick={() => setStep("signup")}
                              className="text-primary underline cursor-pointer"
                           >
                              Sign Up
                           </span>
                        </p>
                     </>
                  )}
                  {step === "signup" && (
                     <p>
                        Already have an account?{" "}
                        <span
                           onClick={() => setStep("login")}
                           className="text-primary underline cursor-pointer"
                        >
                           Login
                        </span>
                     </p>
                  )}
                  {step === "reset" && (
                     <p>
                        Back to{" "}
                        <span
                           onClick={() => setStep("login")}
                           className="text-primary underline cursor-pointer"
                        >
                           Login
                        </span>
                     </p>
                  )}
               </div>
            </div>
            {/* ✅ Admin Button: directly below the card, same width */}
            <div className="min-w-[340px] sm:min-w-96 mt-4">
               <button
                  type="button"
                  onClick={() => (window.location.href = adminUrl)}
                  className="bg-gray-800 border border-gray-600 text-white w-full py-2 rounded-lg hover:bg-gray-900 transition"
               >
                  Go To Admin Panel
               </button>
            </div>
         </div>
      </form>
   );
};

export default Login;
