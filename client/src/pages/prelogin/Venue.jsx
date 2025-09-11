// src/pages/prelogin/Venue.jsx
import React from "react";

const Venue = () => {
   return (
      <div className="max-w-5xl mx-auto py-12 px-6 bg-black text-white">
         <h1 className="text-3xl md:text-4xl font-bold text-blue-500 mb-10 border-b-2 border-green-500 pb-3">
            Venue & Accommodation
         </h1>

         {/* Venue Section */}
         <section className="bg-gray-800 p-6 md:p-8 rounded-xl shadow-lg mb-8">
            <h2 className="text-2xl font-semibold text-white mb-3 border-b border-green-500 pb-2">
               Venue
            </h2>
            <p className="text-gray-300 leading-relaxed">
               Department of Industrial Design <br />
               National Institute of Technology, Rourkela <br />
               Odisha – 769008
            </p>
         </section>

         {/* Accommodation Section */}
         <section className="bg-gray-800 p-6 md:p-8 rounded-xl shadow-lg mb-8">
            <h2 className="text-2xl font-semibold text-white mb-3 border-b border-green-500 pb-2">
               Accommodation
            </h2>
            <p className="text-gray-300 leading-relaxed">
               Limited institute guest house accommodation is available on a{" "}
               <span className="text-green-400 font-medium">
                  first-come-first-serve basis
               </span>{" "}
               subjected to nominal charges. Further, hostel accommodation for
               boys and girls can also be arranged, subject to availability, on
               very nominal charges.
            </p>
         </section>

         {/* Reach Us Section */}
         <section className="bg-gray-800 p-6 md:p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold text-white mb-3 border-b border-green-500 pb-2">
               Reach Us
            </h2>
            <p className="text-gray-300 leading-relaxed">
               The city of Rourkela is a bustling industrial town, cosmopolitan
               by nature and is well connected to all parts of the country by
               road and rail. It is en-route Howrah–Mumbai main line of
               South-Eastern Railway. Nesting amidst greenery on all sides, NIT
               campus is approximately 7 km from Rourkela railway station.
               <br />
               <br />
               The nearest airports are Jharsuguda, Ranchi, Kolkata and
               Bhubaneswar, which are well connected by trains.
            </p>
         </section>
      </div>
   );
};

export default Venue;
