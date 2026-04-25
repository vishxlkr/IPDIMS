import React, { useState, useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import { ReviewerContext } from "../context/ReviewerContext";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
   const [state, setState] = useState("Admin");
   const { setAToken, backendUrl } = useContext(AdminContext);
   const { setRToken } = useContext(ReviewerContext);

   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");

   // const adminUrl = import.meta.env.VITE_CLIENT_URL + "login"; // URL for author login (client app)

   const onSubmitHandler = async (event) => {
      event.preventDefault();
      try {
         if (state === "Admin") {
            const { data } = await axios.post(backendUrl + "/api/admin/login", {
               email,
               password,
            });
            if (data.success) {
               localStorage.setItem("aToken", data.token);
               setAToken(data.token);
            } else {
               toast.error(data.message);
            }
         } else {
            // Reviewer login
            const { data } = await axios.post(
               backendUrl + "/api/reviewer/login",
               { email, password },
            );
            if (data.success) {
               localStorage.setItem("rToken", data.token);
               setRToken(data.token);
            } else {
               toast.error(data.message);
            }
         }
      } catch (error) {
         console.error(error);
         toast.error("Login failed. Please try again.");
      }
   };

   return (
      <div className="min-h-screen flex items-center justify-center">
         <div className="-mt-16">
            <form
               onSubmit={onSubmitHandler}
               className="min-h-[80vh] flex flex-col items-center justify-center gap-4"
            >
               <div className="flex flex-col gap-3 items-start p-8 min-w-[340px] sm:min-w-[24rem] border rounded-xl text-[#5E5E5E] text-sm shadow-lg">
                  <p className="text-2xl font-semibold m-auto">
                     <span className="text-primary">{state}</span> Login
                  </p>
                  <div className="w-full">
                     <p>Email</p>
                     <input
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        type="email"
                        required
                        className="border border-[#DADADA] rounded w-full p-2 mt-1"
                     />
                  </div>
                  <div className="w-full">
                     <p>Password</p>
                     <input
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        type="password"
                        required
                        className="border border-[#DADADA] rounded w-full p-2 mt-1"
                     />
                  </div>
                  <button className="bg-primary text-white w-full py-2 rounded-md text-base">
                     Login
                  </button>

                  {state === "Admin" ? (
                     <p>
                        Reviewer Login?{" "}
                        <span
                           onClick={() => setState("Reviewer")}
                           className="text-primary underline cursor-pointer"
                        >
                           Click here
                        </span>
                     </p>
                  ) : (
                     <p>
                        Admin Login?{" "}
                        <span
                           onClick={() => setState("Admin")}
                           className="text-primary underline cursor-pointer"
                        >
                           Click here
                        </span>
                     </p>
                  )}
               </div>

               {/* NEW BUTTON BOX */}
               {/* <div className="min-w-[340px] sm:min-w-96 mt-4">
                  <button
                     type="button"
                     onClick={() => (window.location.href = adminUrl)}
                     className="bg-gray-800 border border-gray-600 text-white w-full py-2 rounded-lg hover:bg-gray-900 transition"
                  >
                     Go To Author Login
                  </button>
               </div> */}
            </form>
         </div>
      </div>
   );
};

export default Login;
