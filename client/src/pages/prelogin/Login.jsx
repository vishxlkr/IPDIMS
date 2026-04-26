import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Loading from "../../components/Loading";

const Login = () => {
   const {
      token,
      setToken,
      userData,
      setUserData,
      backendUrl,
      loading,
      setLoading,
   } = useContext(AppContext);

   const navigate = useNavigate();
   // const adminUrl = import.meta.env.VITE_ADMIN_URL;

   const [step, setStep] = useState("login");
   const [purpose, setPurpose] = useState("");

   const [name, setName] = useState("");
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [confirmPassword, setConfirmPassword] = useState("");
   const [otp, setOtp] = useState("");

   // ================= AUTH FUNCTIONS =================

   const signup = async () => {
      try {
         setLoading(true);
         const { data } = await axios.post(`${backendUrl}/api/user/signup`, {
            name,
            email,
            password,
         });

         if (data.success) return { success: true };
         toast.error(data.message);
         return { success: false };
      } catch (error) {
         toast.error(error.response?.data?.message || error.message);
         return { success: false };
      } finally {
         setLoading(false);
      }
   };

   const login = async () => {
      try {
         setLoading(true);
         const { data } = await axios.post(`${backendUrl}/api/user/login`, {
            email,
            password,
         });

         const tokenValue = data.user?.token;

         if (data.success && tokenValue) {
            localStorage.setItem("token", tokenValue);
            setToken(tokenValue);
            setUserData(data.user);
            toast.success("Login successful!");
            return { success: true };
         }

         toast.error(data.message);
         return { success: false };
      } catch (error) {
         toast.error(error.response?.data?.message || error.message);
         return { success: false };
      } finally {
         setLoading(false);
      }
   };

   const forgotPassword = async () => {
      try {
         setLoading(true);
         const { data } = await axios.post(
            `${backendUrl}/api/user/forgot-password`,
            { email },
         );

         if (data.success) return { success: true };
         toast.error(data.message);
         return { success: false };
      } catch (error) {
         toast.error(error.response?.data?.message || error.message);
         return { success: false };
      } finally {
         setLoading(false);
      }
   };

   const verifyOtp = async () => {
      try {
         setLoading(true);
         const { data } = await axios.post(
            `${backendUrl}/api/user/verify-otp`,
            { email, otp },
         );

         if (data.success && purpose === "signup") {
            const tokenValue = data.user?.token;
            localStorage.setItem("token", tokenValue);
            setToken(tokenValue);
            setUserData(data.user);
            return { success: true };
         }

         if (data.success && purpose === "reset") {
            return { success: true };
         }

         toast.error(data.message);
         return { success: false };
      } catch (error) {
         toast.error(error.response?.data?.message || error.message);
         return { success: false };
      } finally {
         setLoading(false);
      }
   };

   const resetPassword = async () => {
      try {
         setLoading(true);
         const { data } = await axios.post(
            `${backendUrl}/api/user/reset-password`,
            { email, otp, newPassword: password },
         );

         if (data.success) return { success: true };

         toast.error(data.message);
         return { success: false };
      } catch (error) {
         toast.error(error.response?.data?.message || error.message);
         return { success: false };
      } finally {
         setLoading(false);
      }
   };

   // ================= HANDLE SUBMIT =================

   const handleSubmit = async (e) => {
      e.preventDefault();

      if (step === "login") {
         const res = await login();
         if (res.success) navigate("/dashboard");
      }

      if (step === "signup") {
         const res = await signup();
         if (res.success) {
            setPurpose("signup");
            setStep("otp");
         }
      }

      if (step === "reset") {
         const res = await forgotPassword();
         if (res.success) {
            setPurpose("reset");
            setStep("otp");
         }
      }

      if (step === "otp") {
         const res = await verifyOtp();
         if (res.success) {
            if (purpose === "signup") navigate("/dashboard");
            else setStep("newPassword");
         }
      }

      if (step === "newPassword") {
         if (password !== confirmPassword)
            return toast.error("Passwords do not match!");

         const res = await resetPassword();
         if (res.success) {
            toast.success("Password updated!");
            setStep("login");
         }
      }
   };

   useEffect(() => {
      if (userData) navigate("/dashboard");
   }, [userData, navigate]);

   // ================= UI =================

   return (
      <div className="min-h-screen flex items-center justify-center">
         <div className="-mt-16">
            <form
               onSubmit={handleSubmit}
               className="min-h-[calc(100vh-4rem)] mt-16 flex flex-col items-center justify-center gap-4"
            >
               <div className="flex flex-col gap-3 items-start p-8 min-w-[340px] sm:min-w-[24rem] border rounded-xl text-[#5E5E5E] text-sm shadow-lg relative">
                  {loading && <Loading />}

                  <p className="text-2xl font-semibold m-auto">
                     <span>
                        {step === "login"
                           ? "Login"
                           : step === "signup"
                             ? "Sign Up"
                             : step === "reset"
                               ? "Reset"
                               : step === "otp"
                                 ? "OTP"
                                 : "New Password"}
                     </span>
                  </p>

                  {step === "signup" && (
                     <div className="w-full">
                        <p>Name</p>
                        <input
                           type="text"
                           value={name}
                           onChange={(e) => setName(e.target.value)}
                           className="border border-[#DADADA] rounded w-full p-2 mt-1"
                           required
                        />
                     </div>
                  )}

                  {step !== "otp" && step !== "newPassword" && (
                     <div className="w-full">
                        <p>Email</p>
                        <input
                           type="email"
                           value={email}
                           onChange={(e) => setEmail(e.target.value)}
                           className="border border-[#DADADA] rounded w-full p-2 mt-1"
                           required
                        />
                     </div>
                  )}

                  {(step === "login" ||
                     step === "signup" ||
                     step === "newPassword") && (
                     <div className="w-full">
                        <p>
                           {step === "newPassword"
                              ? "New Password"
                              : "Password"}
                        </p>
                        <input
                           type="password"
                           value={password}
                           onChange={(e) => setPassword(e.target.value)}
                           className="border border-[#DADADA] rounded w-full p-2 mt-1"
                           required
                        />
                     </div>
                  )}

                  {step === "newPassword" && (
                     <div className="w-full">
                        <p>Confirm Password</p>
                        <input
                           type="password"
                           value={confirmPassword}
                           onChange={(e) => setConfirmPassword(e.target.value)}
                           className="border border-[#DADADA] rounded w-full p-2 mt-1"
                           required
                        />
                     </div>
                  )}

                  {step === "otp" && (
                     <div className="w-full">
                        <p>Enter OTP</p>
                        <p className="mt-1 text-xs text-gray-500">
                           OTP is been sent to {email}
                        </p>
                        <input
                           type="text"
                           value={otp}
                           onChange={(e) => setOtp(e.target.value)}
                           className="border border-[#DADADA] rounded w-full p-2 mt-1"
                           required
                        />
                     </div>
                  )}

                  <button className="bg-primary text-white w-full py-2 rounded-md text-base mt-2">
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

                  {/* LINKS */}
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

               {/* SWITCH BUTTON */}
               {/* <div className="min-w-[340px] sm:min-w-96 mt-4">
                  <button
                     type="button"
                     onClick={() => (window.location.href = adminUrl)}
                     className="bg-gray-800 border border-gray-600 text-white w-full py-2 rounded-lg hover:bg-gray-900 transition"
                  >
                     Go To Admin Login
                  </button>
               </div> */}
            </form>{" "}
         </div>
      </div>
   );
};

export default Login;
