import React from "react";

const Venue = () => {
   return (
      <div className="bg-black text-white min-h-screen py-10 px-6 font-sans">
         <div className="max-w-7xl mx-auto space-y-8">
            {/* Page Title */}
            <header className="text-center">
               <h1 className="text-3xl md:text-5xl font-extrabold text-blue-500 mb-10 text-center tracking-wide">
                  Venue & Accommodation
               </h1>
            </header>

            {/* Venue Section */}
            <section className="bg-white/10 backdrop-blur-xl border border-gray-700 rounded-2xl shadow-xl p-6 md:p-8 hover:scale-102 transition-transform duration-300">
               <h2 className="text-2xl font-bold text-blue-400 mb-4 border-b border-green-500 pb-2">
                  Venue
               </h2>
               <p className="text-gray-300 leading-relaxed text-lg">
                  Department of Industrial Design <br />
                  National Institute of Technology, Rourkela <br />
                  Odisha – 769008
               </p>
            </section>

            {/* Accommodation Section */}
            <section className="bg-white/10 backdrop-blur-xl border border-gray-700 rounded-2xl shadow-xl p-6 md:p-8 hover:scale-102 transition-transform duration-300">
               <h2 className="text-2xl font-bold text-blue-400 mb-4 border-b border-green-500 pb-2">
                  Accommodation
               </h2>
               <p className="text-gray-300 leading-relaxed text-lg">
                  Limited institute guest house accommodation is available on a{" "}
                  <span className="text-green-500 font-medium">
                     first-come-first-serve basis
                  </span>{" "}
                  subjected to nominal charges. Further, hostel accommodation
                  for boys and girls can also be arranged, subject to
                  availability, on very nominal charges.
               </p>
            </section>

            {/* Reach Us Section */}
            <section className="bg-white/10 backdrop-blur-xl border border-gray-700 rounded-2xl shadow-xl p-6 md:p-8 hover:scale-102 transition-transform duration-300">
               <h2 className="text-2xl font-bold text-blue-400 mb-4 border-b border-green-500 pb-2">
                  Reach Us
               </h2>
               <p className="text-gray-300 leading-relaxed text-lg">
                  The city of Rourkela is a bustling industrial town,
                  cosmopolitan by nature and is well connected to all parts of
                  the country by road and rail. It is en-route Howrah–Mumbai
                  main line of South-Eastern Railway. Nesting amidst greenery on
                  all sides, NIT campus is approximately 7 km from Rourkela
                  railway station.
                  <br />
                  <br />
                  The nearest airports are Jharsuguda, Ranchi, Kolkata and
                  Bhubaneswar, which are well connected by trains.
               </p>
            </section>
         </div>
      </div>
   );
};

export default Venue;
