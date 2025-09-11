import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";

const Navbar = () => {
   const [menuOpen, setMenuOpen] = useState(false);

   useEffect(() => {
      document.body.style.overflow = menuOpen ? "hidden" : "";
   }, [menuOpen]);

   const navLinks = [
      { path: "/", label: "Home" },
      { path: "/submission", label: "Submission" },
      { path: "/important-dates", label: "Important Dates" },
      { path: "/registration", label: "Registration" },
      { path: "/committee", label: "Committee" },
      { path: "/Venue", label: "Venue & Accomodation " },
      { path: "/contact-us", label: "Contact " },
   ];

   return (
      <nav className="fixed top-0 w-full z-40 bg-[rgba(10,10,10,0.8)] backdrop-blur-lg border-b border-white/10 shadow-lg">
         <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between items-center h-16">
               {/* Left: Logo + Brand */}
               <div className="flex items-center space-x-2">
                  <img src={logo} alt="logo" className="h-8 w-8" />
                  <NavLink to="/" className="text-xl font-bold text-white">
                     <span className="text-blue-500"></span>IPDIMS
                  </NavLink>
               </div>

               {/* Center: Nav Links (Desktop only) */}
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

               {/* Right: Login + Hamburger */}
               <div className="flex items-center space-x-4">
                  <NavLink
                     to="/login"
                     className="px-4 py-2 rounded-3xl bg-blue-600 text-white hover:bg-blue-700 transition"
                  >
                     Login
                  </NavLink>

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

         {/* Mobile Menu (Tabs only) */}
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
            </div>
         )}
      </nav>
   );
};

export default Navbar;
