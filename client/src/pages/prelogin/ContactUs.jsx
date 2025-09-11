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
      <div className=" bg-black text-white max-w-5xl mx-auto py-12 px-6 ">
         <h1 className="text-3xl md:text-4xl font-bold text-blue-500 mb-10 border-b-2 border-green-500 pb-3">
            Contact Us
         </h1>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {contacts.map((person, idx) => (
               <div
                  key={idx}
                  className="bg-white/10  border-1 p-6 rounded-xl shadow-lg hover:scale-101 transition-transform duration-300"
               >
                  <h2 className="text-xl font-bold text-white mb-2">
                     {person.name}
                  </h2>
                  <p className="text-sm text-green-400 mb-1">{person.role}</p>
                  <p className="text-gray-300">{person.designation}</p>
                  <p className="text-gray-300">{person.dept}</p>
                  <p className="text-gray-300 mb-2">{person.institute}</p>
                  <p className="text-gray-400">📞 {person.phone}</p>
               </div>
            ))}
         </div>
      </div>
   );
};

export default ContactUs;
