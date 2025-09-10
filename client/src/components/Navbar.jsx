import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
   const [isOpen, setIsOpen] = useState(false);
   const [scrolled, setScrolled] = useState(false);

   const toggleMenu = () => {
      setIsOpen(!isOpen);
   };

   // Listen to scroll event
   useEffect(() => {
      const handleScroll = () => {
         if (window.scrollY > 50) {
            setScrolled(true);
         } else {
            setScrolled(false);
         }
      };
      window.addEventListener("scroll", handleScroll);

      return () => {
         window.removeEventListener("scroll", handleScroll);
      };
   }, []);

   return (
      <nav
         className={`fixed w-full z-50 transition-colors duration-500 ${
            scrolled ? "bg-black text-white shadow-lg" : "bg-white text-black"
         }`}
      >
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
               {/* Logo */}
               <div className="flex-shrink-0">
                  <Link
                     to="/"
                     className={`text-2xl font-bold transition-colors duration-500 ${
                        scrolled ? "text-white" : "text-black"
                     }`}
                  >
                     MyApp
                  </Link>
               </div>

               {/* Desktop Menu */}
               <div className="hidden md:flex space-x-6">
                  {["Home", "About", "Dashboard", "Login", "Register"].map(
                     (item) => (
                        <Link
                           key={item}
                           to={`/${item.toLowerCase()}`}
                           className={`hover:text-gray-400 transition-colors duration-300 ${
                              scrolled ? "text-white" : "text-black"
                           }`}
                        >
                           {item}
                        </Link>
                     )
                  )}
               </div>

               {/* Mobile Menu Button */}
               <div className="md:hidden flex items-center">
                  <button onClick={toggleMenu} className="focus:outline-none">
                     <svg
                        className={`h-6 w-6 transition-colors duration-300 ${
                           scrolled ? "text-white" : "text-black"
                        }`}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                     >
                        {isOpen ? (
                           <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M6 18L18 6M6 6l12 12"
                           />
                        ) : (
                           <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M4 6h16M4 12h16M4 18h16"
                           />
                        )}
                     </svg>
                  </button>
               </div>
            </div>
         </div>

         {/* Mobile Menu */}
         {isOpen && (
            <div className="md:hidden bg-blue-500 px-2 pt-2 pb-3 space-y-1">
               {["Home", "About", "Dashboard", "Login", "Register"].map(
                  (item) => (
                     <Link
                        key={item}
                        to={`/${item.toLowerCase()}`}
                        className="block px-3 py-2 rounded hover:bg-blue-600 text-white"
                     >
                        {item}
                     </Link>
                  )
               )}
            </div>
         )}
      </nav>
   );
};

export default Navbar;
