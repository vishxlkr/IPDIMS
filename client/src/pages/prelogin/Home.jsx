import { Link } from "react-router-dom";

const Home = () => {
   return (
      <div className="pt-20 min-h-screen bg-gray-50 flex flex-col items-center">
         <h1 className="text-4xl font-bold text-gray-800 mb-6">
            Welcome to IPDIMS
         </h1>
         <p className="text-lg text-gray-600 mb-8 text-center max-w-xl">
            The International Paper & Digital Innovation Management System
            (IPDIMS) is your one-stop platform for paper submission, review, and
            tracking.
         </p>

         <div className="flex space-x-4">
            <Link
               to="/registration"
               className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
            >
               Register Now
            </Link>
            <Link
               to="/submission-guidelines"
               className="bg-gray-200 text-gray-800 px-6 py-3 rounded hover:bg-gray-300"
            >
               Submission Guidelines
            </Link>
         </div>

         <div className="mt-16 w-full max-w-4xl px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="bg-white shadow-md p-4 rounded hover:shadow-lg transition">
               <h2 className="font-bold text-xl mb-2">Important Dates</h2>
               <p className="text-gray-600">
                  View deadlines for submissions, reviews, and results.
               </p>
            </div>
            <div className="bg-white shadow-md p-4 rounded hover:shadow-lg transition">
               <h2 className="font-bold text-xl mb-2">Committee</h2>
               <p className="text-gray-600">
                  Meet our expert committee members for guidance and evaluation.
               </p>
            </div>
            <div className="bg-white shadow-md p-4 rounded hover:shadow-lg transition">
               <h2 className="font-bold text-xl mb-2">Venue</h2>
               <p className="text-gray-600">
                  Learn more about where the event and presentations will take
                  place.
               </p>
            </div>
            <div className="bg-white shadow-md p-4 rounded hover:shadow-lg transition">
               <h2 className="font-bold text-xl mb-2">Contact Us</h2>
               <p className="text-gray-600">
                  Get in touch for support, queries, or assistance.
               </p>
            </div>
         </div>
      </div>
   );
};

export default Home;
