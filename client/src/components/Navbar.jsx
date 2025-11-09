import React, { useState, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // ✅ added import
import logo from "../assets/logo.png";
import { AppContext } from "../context/AppContext";

const Navbar = () => {
   const navigate = useNavigate();
   const { token, setToken, userData, setUserData } = useContext(AppContext); // ✅ added setToken

   const [menuOpen, setMenuOpen] = useState(false);
   const [profileMenuOpen, setProfileMenuOpen] = useState(false);

   console.log("Navbar userData:", userData);

   const handleLogout = () => {
      // ✅ Clear everything in correct order
      setToken("");
      setUserData(null);
      localStorage.removeItem("token");
      setProfileMenuOpen(false);
      setMenuOpen(false);
      toast.success("Logged out successfully");
      navigate("/");
   };

   const navLinks = [
      { path: "/", label: "Home" },
      { path: "/submission", label: "Submission" },
      { path: "/important-dates", label: "Important Dates" },
      { path: "/registration", label: "Registration" },
      { path: "/committee", label: "Committee" },
      { path: "/venue", label: "Venue & Accommodation" },
      { path: "/contact-us", label: "Contact" },
   ];

   return (
      <nav className="fixed top-0 w-full z-40 bg-[rgba(10,10,10,0.8)] backdrop-blur-lg border-b border-white/10 shadow-lg">
         <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between items-center h-16">
               {/* Left: Logo + Brand */}
               <div className="flex items-center space-x-2">
                  <img
                     src={logo}
                     alt="logo"
                     className="h-8 w-8 cursor-pointer"
                     onClick={() => navigate("/")}
                  />
                  <NavLink to="/" className="text-xl font-bold text-white">
                     IPDIMS
                  </NavLink>
               </div>

               {/* Center: Nav Links */}
               <div className="hidden md:flex items-center space-x-8">
                  {navLinks.map(({ path, label }) => (
                     <NavLink
                        key={path}
                        to={path}
                        className={({ isActive }) =>
                           `transition-colors ${
                              isActive
                                 ? "text-white font-semibold"
                                 : "text-gray-300 hover:text-white"
                           }`
                        }
                     >
                        {label}
                     </NavLink>
                  ))}
               </div>

               {/* Right: Login / Profile */}
               <div className="flex items-center space-x-4 relative">
                  {!token || !userData ? (
                     <NavLink
                        to="/login"
                        className="px-4 py-2 rounded-3xl bg-blue-600 text-white hover:bg-blue-700 transition"
                     >
                        Login
                     </NavLink>
                  ) : (
                     <div
                        className="relative cursor-pointer"
                        onMouseEnter={() => setProfileMenuOpen(true)}
                        onMouseLeave={() => setProfileMenuOpen(false)}
                     >
                        <img
                           src={userData.image || "/default-avatar.png"}
                           alt="user"
                           className="w-8 h-8 rounded-full object-cover"
                        />

                        {/* Dropdown Menu */}
                        <div
                           className={`absolute right-0 mt-2 w-40 bg-white text-black rounded-md shadow-lg flex flex-col z-50 transition-all duration-200 ${
                              profileMenuOpen
                                 ? "opacity-100 visible"
                                 : "opacity-0 invisible"
                           }`}
                        >
                           <button
                              onClick={() => {
                                 navigate("/dashboard");
                                 setProfileMenuOpen(false);
                              }}
                              className="hover:bg-gray-100 text-left px-4 py-2"
                           >
                              Dashboard
                           </button>

                           <button
                              onClick={handleLogout}
                              className="hover:bg-gray-100 text-left px-4 py-2"
                           >
                              Logout
                           </button>
                        </div>
                     </div>
                  )}

                  {/* Mobile Hamburger */}
                  <button
                     className="md:hidden text-white text-2xl"
                     onClick={() => setMenuOpen((prev) => !prev)}
                  >
                     {menuOpen ? "✕" : "☰"}
                  </button>
               </div>
            </div>
         </div>

         {/* Mobile Menu */}
         {menuOpen && (
            <div className="md:hidden absolute top-16 left-0 w-full bg-[rgba(10,10,10,0.95)] backdrop-blur-lg border-b border-white/10 shadow-lg flex flex-col items-center space-y-6 py-6">
               {navLinks.map(({ path, label }) => (
                  <NavLink
                     key={path}
                     to={path}
                     onClick={() => setMenuOpen(false)}
                     className={({ isActive }) =>
                        `transition-colors text-lg ${
                           isActive
                              ? "text-white font-semibold"
                              : "text-gray-300 hover:text-white"
                        }`
                     }
                  >
                     {label}
                  </NavLink>
               ))}

               {!token || !userData ? (
                  <NavLink
                     to="/login"
                     onClick={() => setMenuOpen(false)}
                     className="px-4 py-2 rounded-3xl bg-blue-600 text-white hover:bg-blue-700 transition"
                  >
                     Login
                  </NavLink>
               ) : (
                  <div className="flex flex-col items-center">
                     <p
                        onClick={() => {
                           navigate("/dashboard");
                           setMenuOpen(false);
                        }}
                        className="px-4 py-2 rounded-3xl bg-gray-200 text-black hover:bg-gray-300 cursor-pointer w-36 text-center"
                     >
                        Dashboard
                     </p>
                     <p
                        onClick={handleLogout}
                        className="px-4 py-2 rounded-3xl bg-gray-200 text-black hover:bg-gray-300 cursor-pointer w-36 text-center"
                     >
                        Logout
                     </p>
                  </div>
               )}
            </div>
         )}
      </nav>
   );
};

export default Navbar;
