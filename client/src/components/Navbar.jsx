

import React, { useState, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../assets/logo.png";
import { AppContext } from "../context/AppContext";

const Navbar = () => {
   const navigate = useNavigate();
   const { token, setToken, userData, setUserData } = useContext(AppContext);

   const [menuOpen, setMenuOpen] = useState(false);
   const [profileMenuOpen, setProfileMenuOpen] = useState(false);

   const handleLogoClick = () => {
      navigate("/");
      window.scrollTo(0, 0);
   };

   const handleLogout = () => {
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
      <nav className="fixed top-0 w-full z-40 bg-[#0a0a0a] border-b border-white/10 shadow-lg">
         <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between items-center h-16">
               {/* Left: Logo + Brand */}
               <div className="flex items-center space-x-2">
                  <img
                     src={logo}
                     alt="logo"
                     className="h-8 w-8 cursor-pointer transition-transform duration-200 hover:scale-110"
                     onClick={handleLogoClick}
                  />
                  <div
                     onClick={handleLogoClick}
                     className="text-xl font-bold text-white transition-transform duration-200 hover:scale-105 cursor-pointer"
                  >
                     IPDIMS
                  </div>
               </div>

               {/* Center: Nav Links */}
               <div className="hidden md:flex items-center space-x-8">
                  {navLinks.map(({ path, label }) => (
                     <NavLink
                        key={path}
                        to={path}
                        className={({ isActive }) =>
                           `transition-transform duration-200 hover:scale-110 ${
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
                        className="px-4 py-2 rounded-lg bg-linear-to-r from-blue-500 to-blue-700 text-white font-semibold  transition-transform duration-200 hover:scale-105"
                     >
                        Login
                     </NavLink>
                  ) : (
                     <div
                        className="relative cursor-pointer group"
                        onMouseEnter={() => setProfileMenuOpen(true)}
                        onMouseLeave={() => setProfileMenuOpen(false)}
                     >
                        <div className="flex items-center space-x-2 bg-white/5 hover:bg-white/10 p-1 rounded-full transition-all duration-300 border border-white/5 hover:border-white/20">
                           <div className="w-8 h-8 rounded-full bg-linear-to-r from-blue-500 to-blue-700 flex items-center justify-center text-white  text-lg transition-transform duration-300 group-hover:scale-105 group-hover:ring-2 ring-white/30">
                              {userData?.name?.charAt(0).toUpperCase() || 'U'}
                           </div>
                        </div>

                        {/* Dropdown Menu */}
                        <div
                           className={`absolute right-0 mt-3 w-44 bg-white text-black rounded-xl shadow-2xl flex flex-col z-50 transition-all duration-300 border border-gray-100 origin-top-right ${
                              profileMenuOpen
                                 ? "opacity-100 visible scale-100 translate-y-0"
                                 : "opacity-0 invisible scale-95 -translate-y-2"
                           }`}
                        >
                           <div className="py-2">
                              <button
                                 onClick={() => {
                                    navigate("/dashboard");
                                    setProfileMenuOpen(false);
                                 }}
                                 className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-all duration-200"
                              >
                                 Dashboard
                              </button>

                              <button
                                 onClick={handleLogout}
                                 className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                              >
                                 Logout
                              </button>
                           </div>
                        </div>
                     </div>
                  )}

                  {/* Mobile Hamburger */}
                  <button
                     className="md:hidden text-white text-2xl transition-transform duration-200 hover:scale-110"
                     onClick={() => setMenuOpen((prev) => !prev)}
                  >
                     {menuOpen ? "✕" : "☰"}
                  </button>
               </div>
            </div>
         </div>

         {/* Mobile Menu */}
         {menuOpen && (
            <div className="md:hidden absolute top-16 left-0 w-full bg-[rgba(10,10,10,0.95)]  border-b border-white/10 shadow-lg flex flex-col items-center space-y-6 py-6">
               {navLinks.map(({ path, label }) => (
                  <NavLink
                     key={path}
                     to={path}
                     onClick={() => setMenuOpen(false)}
                     className={({ isActive }) =>
                        `text-lg transition-transform duration-200 hover:scale-110 ${
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
                     className="px-4 py-2 rounded-3xl bg-blue-600 text-white hover:bg-blue-700 transition-transform duration-200 hover:scale-105"
                  >
                     Login
                  </NavLink>
               ) : (
                  <div className="flex flex-col items-center space-y-4">
                     <div className="w-12 h-12 rounded-full bg-linear-to-r from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-xl border-2 border-white/20">
                        {userData?.name?.charAt(0).toUpperCase() || 'U'}
                     </div>
                     <p
                        onClick={() => {
                           navigate("/dashboard");
                           setMenuOpen(false);
                        }}
                        className="px-4 py-2 rounded-3xl bg-gray-200 text-black hover:bg-gray-300 cursor-pointer w-36 text-center transition-transform duration-200 hover:scale-105"
                     >
                        Dashboard
                     </p>
                     <p
                        onClick={handleLogout}
                        className="px-4 py-2 rounded-3xl bg-gray-200 text-black hover:bg-gray-300 cursor-pointer w-36 text-center transition-transform duration-200 hover:scale-105"
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
