// src/pages/prelogin/ContactUs.jsx
import React from "react";

const ContactUs = () => {
   const contacts = [
      {
         name: "Prof. BBVL Deepak",
         role: "Convener, IPDIMS",
         designation: "Associate Professor",
         dept: "Department of Industrial Design",
         institute: "National Institute of Technology, Rourkela",
         phone: "0661 2462855(o)",
      },
      {
         name: "Prof. Dayal R Parhi",
         role: "Chairman, IPDIMS",
         designation: "Professor (HAG)",
         dept: "Department of Mechanical Engineering",
         institute: "National Institute of Technology, Rourkela",
         phone: "0661 2465140",
      },
      {
         name: "Prof. Mohit Lal",
         role: "Coordinator, IPDIMS",
         designation: "Assistant Professor",
         dept: "Department of Industrial Design",
         institute: "National Institute of Technology, Rourkela",
         phone: "0661 2462856(o)",
      },
      {
         name: "Prof. Dibya P Jean",
         role: "Coordinator, IPDIMS",
         designation: "Associate Professor & Head of the Department",
         dept: "Department of Industrial Design",
         institute: "National Institute of Technology, Rourkela",
         phone: "0661 2462855(o)",
      },
   ];

   return (
      <div className="bg-black text-white min-h-screen py-10 px-6 font-sans">
         <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-extrabold text-blue-500 mb-10 text-center tracking-wide">
               Contact Us
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {contacts.map((person, idx) => (
                  <div
                     key={idx}
                     className="bg-white/10 backdrop-blur-xl border border-gray-700 p-8 rounded-2xl shadow-xl hover:scale-105 transition-transform duration-300"
                  >
                     <h2 className="text-2xl font-bold text-blue-400 mb-2">
                        {person.name}
                     </h2>
                     <p className="text-sm text-green-400 font-semibold mb-1">
                        {person.role}
                     </p>
                     <p className="text-gray-300 text-lg">
                        {person.designation}
                     </p>
                     <p className="text-gray-300 text-lg">{person.dept}</p>
                     <p className="text-gray-300 mb-2 text-lg">
                        {person.institute}
                     </p>
                     <p className="text-gray-400 font-medium">
                        📞 {person.phone}
                     </p>
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
};

export default ContactUs;
