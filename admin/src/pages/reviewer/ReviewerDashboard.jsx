import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
   FileText,
   Clock,
   CheckCircle,
   XCircle,
   AlertCircle,
   TrendingUp,
   Eye,
} from "lucide-react";

const ReviewerDashboard = () => {
   const [stats, setStats] = useState({
      total: 0,
      pending: 0,
      accepted: 0,
      rejected: 0,
      revisionRequested: 0,
   });
   const [recentSubmissions, setRecentSubmissions] = useState([]);
   const [loading, setLoading] = useState(true);

   const backendUrl = "http://localhost:4000";
   const rtoken = localStorage.getItem("rToken");

   useEffect(() => {
      fetchDashboardData();
      fetchRecentSubmissions();
   }, []);

   const fetchDashboardData = async () => {
      try {
         const { data } = await axios.get(
            `${backendUrl}/api/reviewer/dashboard`,
            {
               headers: { rtoken },
            }
         );

         if (data.success) {
            setStats(data.stats);
         }
      } catch (error) {
         console.error("Error fetching dashboard stats:", error);
         toast.error("Failed to load dashboard statistics");
      }
   };

   const fetchRecentSubmissions = async () => {
      try {
         setLoading(true);
         const { data } = await axios.get(
            `${backendUrl}/api/reviewer/submissions`,
            {
               headers: { rtoken },
            }
         );

         if (data.success) {
            setRecentSubmissions(data.submissions.slice(0, 5));
         }
      } catch (error) {
         console.error("Error fetching submissions:", error);
         toast.error("Failed to load recent submissions");
      } finally {
         setLoading(false);
      }
   };

   const handleViewAllSubmissions = () => {
      window.location.href = "/reviewer/submissions";
   };

   if (loading) {
      return (
         <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-gray-50 p-6 -m-8">
         <div className="max-w-7xl mx-auto">
            <div className="mb-8">
               <h1 className="text-4xl font-bold text-gray-800">
                  Reviewer Dashboard
               </h1>
               <p className="text-gray-600 mt-2">
                  Welcome back! Here's an overview of your assigned submissions
               </p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
               <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
                  <div className="flex items-center justify-between">
                     <div>
                        <p className="text-sm text-gray-500 font-semibold uppercase">
                           Total Assigned
                        </p>
                        <p className="text-3xl font-bold text-gray-800 mt-2">
                           {stats.total}
                        </p>
                     </div>
                     <FileText className="w-12 h-12 text-blue-500" />
                  </div>
               </div>

               <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
                  <div className="flex items-center justify-between">
                     <div>
                        <p className="text-sm text-gray-500 font-semibold uppercase">
                           Under Review
                        </p>
                        <p className="text-3xl font-bold text-gray-800 mt-2">
                           {stats.pending}
                        </p>
                     </div>
                     <Clock className="w-12 h-12 text-yellow-500" />
                  </div>
               </div>

               <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
                  <div className="flex items-center justify-between">
                     <div>
                        <p className="text-sm text-gray-500 font-semibold uppercase">
                           Accepted
                        </p>
                        <p className="text-3xl font-bold text-gray-800 mt-2">
                           {stats.accepted}
                        </p>
                     </div>
                     <CheckCircle className="w-12 h-12 text-green-500" />
                  </div>
               </div>

               <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
                  <div className="flex items-center justify-between">
                     <div>
                        <p className="text-sm text-gray-500 font-semibold uppercase">
                           Rejected
                        </p>
                        <p className="text-3xl font-bold text-gray-800 mt-2">
                           {stats.rejected}
                        </p>
                     </div>
                     <XCircle className="w-12 h-12 text-red-500" />
                  </div>
               </div>

               <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500">
                  <div className="flex items-center justify-between">
                     <div>
                        <p className="text-sm text-gray-500 font-semibold uppercase">
                           Revision Req.
                        </p>
                        <p className="text-3xl font-bold text-gray-800 mt-2">
                           {stats.revisionRequested}
                        </p>
                     </div>
                     <AlertCircle className="w-12 h-12 text-orange-500" />
                  </div>
               </div>
            </div>

            {/* Recent Submissions */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
               <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                     <h2 className="text-2xl font-bold text-gray-800">
                        Recent Submissions
                     </h2>
                     <button
                        onClick={handleViewAllSubmissions}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
                     >
                        View All
                        <TrendingUp className="w-4 h-4" />
                     </button>
                  </div>
               </div>

               <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                     <thead className="bg-gray-50">
                        <tr>
                           <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Title
                           </th>
                           <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Author
                           </th>
                           <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Status
                           </th>
                           <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Date Assigned
                           </th>
                           <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Action
                           </th>
                        </tr>
                     </thead>
                     <tbody className="bg-white divide-y divide-gray-200">
                        {recentSubmissions.length > 0 ? (
                           recentSubmissions.map((submission) => (
                              <tr
                                 key={submission._id}
                                 className="hover:bg-gray-50 transition-colors"
                              >
                                 <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                                       {submission.title || "Untitled"}
                                    </div>
                                 </td>
                                 <td className="px-6 py-4">
                                    <div className="text-sm text-gray-900">
                                       {submission.user?.name ||
                                          submission.author?.name ||
                                          "N/A"}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                       {submission.user?.email ||
                                          submission.author?.email}
                                    </div>
                                 </td>
                                 <td className="px-6 py-4">
                                    <span
                                       className={`px-3 py-1.5 text-xs font-semibold rounded-full ${
                                          submission.status === "Accepted"
                                             ? "bg-green-100 text-green-800"
                                             : submission.status === "Rejected"
                                             ? "bg-red-100 text-red-800"
                                             : submission.status ===
                                               "Under Review"
                                             ? "bg-blue-100 text-blue-800"
                                             : submission.status ===
                                               "Revision Requested"
                                             ? "bg-orange-100 text-orange-800"
                                             : "bg-yellow-100 text-yellow-800"
                                       }`}
                                    >
                                       {submission.status}
                                    </span>
                                 </td>
                                 <td className="px-6 py-4 text-sm text-gray-600">
                                    {new Date(
                                       submission.createdAt
                                    ).toLocaleDateString()}
                                 </td>
                                 <td className="px-6 py-4">
                                    <button
                                       onClick={handleViewAllSubmissions}
                                       className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                       title="View Details"
                                    >
                                       <Eye className="w-5 h-5" />
                                    </button>
                                 </td>
                              </tr>
                           ))
                        ) : (
                           <tr>
                              <td
                                 colSpan="5"
                                 className="px-6 py-12 text-center text-gray-500"
                              >
                                 No submissions assigned yet
                              </td>
                           </tr>
                        )}
                     </tbody>
                  </table>
               </div>
            </div>
         </div>
      </div>
   );
};

export default ReviewerDashboard;
