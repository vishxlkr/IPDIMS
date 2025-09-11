import React from "react";

const ImportantDates = () => {
   const dates = [
      {
         title: "Last date for submission of full-length paper",
         date: "25-09-2025",
      },
      {
         title: "Author notification",
         date: "25-10-2025",
      },
      {
         title: "Submission of Revised Paper",
         date: "15-11-2025",
      },
      {
         title: "Early bird Registration",
         date: "Till 20-11-2025",
      },
      {
         title: "Late Registration",
         date: "21 to 27-11-2025",
      },
      {
         title: "Conference Dates",
         date: "27 & 28 December 2025",
      },
   ];

   return (
      <div className="bg-gray-50 min-h-screen py-12 px-6 md:px-16 font-sans text-gray-800">
         {/* Section Title */}
         <h2 className="text-3xl font-bold text-center mb-12">
            Important Dates
         </h2>

         {/* Dates List */}
         <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8 space-y-6">
            {dates.map((item, index) => (
               <div
                  key={index}
                  className="flex flex-col md:flex-row md:justify-between md:items-center border-b last:border-b-0 pb-4 md:pb-2"
               >
                  <span className="text-lg font-medium text-gray-700">
                     {item.title}
                  </span>
                  <span className="text-lg font-semibold text-gray-900 mt-2 md:mt-0">
                     {item.date}
                  </span>
               </div>
            ))}
         </div>
      </div>
   );
};

export default ImportantDates;
