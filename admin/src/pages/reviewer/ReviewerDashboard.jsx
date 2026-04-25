import React, { useState, useEffect, useContext } from "react";
import Loading from "../../components/Loading";
import axios from "axios";
import { toast } from "react-toastify";
import {
   FileText,
   Clock,
   CheckCircle,
   XCircle,
   AlertCircle,
   TrendingUp,
} from "lucide-react";
import { AdminContext } from "../../context/AdminContext";

const ReviewerDashboard = () => {
   const [stats, setStats] = useState({
      total: 0,
      pending: 0,
      completed: 0,
   });
   const [recentSubmissions, setRecentSubmissions] = useState([]);
   const [loading, setLoading] = useState(true);

   // const backendUrl = "http://localhost:4000";
   const { backendUrl } = useContext(AdminContext);
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
            },
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
            },
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

   if (loading) return <Loading />;

   return (
      <div className="min-h-[calc(100vh-5rem)] bg-gray-50 px-7 py-8">
         <div className="w-full">
            <div className="mb-8">
               <h1 className="text-3xl font-bold text-slate-950">Dashboard</h1>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
               <div className="bg-white rounded shadow-[0_18px_45px_rgba(15,23,42,0.06)] p-6 ">
                  <div className="flex items-center justify-between">
                     <div>
                        <p className="text-sm text-slate-500 font-semibold uppercase">
                           Total Assigned
                        </p>
                        <p className="text-3xl font-bold text-slate-950 mt-2">
                           {stats.total}
                        </p>
                     </div>
                     <FileText className="w-12 h-12 text-cyan-600" />
                  </div>
               </div>

               <div className="bg-white rounded shadow-[0_18px_45px_rgba(15,23,42,0.06)] p-6 ">
                  <div className="flex items-center justify-between">
                     <div>
                        <p className="text-sm text-slate-500 font-semibold uppercase">
                           Pending Review
                        </p>
                        <p className="text-3xl font-bold text-slate-950 mt-2">
                           {stats.pending}
                        </p>
                     </div>
                     <Clock className="w-12 h-12 text-yellow-500" />
                  </div>
               </div>

               <div className="bg-white rounded shadow-[0_18px_45px_rgba(15,23,42,0.06)] p-6 ">
                  <div className="flex items-center justify-between">
                     <div>
                        <p className="text-sm text-slate-500 font-semibold uppercase">
                           Completed Reviews
                        </p>
                        <p className="text-3xl font-bold text-slate-950 mt-2">
                           {stats.completed}
                        </p>
                     </div>
                     <CheckCircle className="w-12 h-12 text-green-500" />
                  </div>
               </div>
            </div>

            {/* Recent Submissions */}
            <div className="bg-white rounded shadow-[0_18px_45px_rgba(15,23,42,0.06)] overflow-hidden border border-slate-200">
               <div className="p-6 border-b border-slate-200">
                  <div className="flex items-center justify-between">
                     <h2 className="text-2xl font-bold text-slate-950">
                        Recent Submissions
                     </h2>
                     <button
                        onClick={handleViewAllSubmissions}
                        className="text-cyan-600 hover:text-cyan-700 font-medium text-sm flex items-center gap-1"
                     >
                        View All
                        <TrendingUp className="w-4 h-4" />
                     </button>
                  </div>
               </div>

               <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-transparent">
                     <thead className="bg-white">
                        <tr>
                           <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                              Paper ID
                           </th>
                           <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                              Title
                           </th>
                           <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                              Author
                           </th>
                           <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                              Status
                           </th>
                           <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                              Date Assigned
                           </th>
                        </tr>
                     </thead>
                     <tbody className="bg-white divide-y divide-transparent">
                        {recentSubmissions.length > 0 ? (
                           recentSubmissions.map((submission) => (
                              <tr
                                 key={submission._id}
                                 className="hover:bg-gray-50 transition-colors"
                              >
                                 {" "}
                                 <td className="px-6 py-4">
                                    <div className="text-sm font-bold text-slate-700">
                                       {submission.paperId ?? "-"}
                                    </div>
                                 </td>
                                 <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-slate-950 max-w-xs truncate">
                                       {submission.title || "Untitled"}
                                    </div>
                                 </td>
                                 <td className="px-6 py-4">
                                    <div className="text-sm text-slate-950">
                                       {submission.user?.name ||
                                          submission.author?.name ||
                                          "N/A"}
                                    </div>
                                    <div className="text-xs text-slate-500">
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
                                                 ? "bg-cyan-100 text-cyan-700"
                                                 : submission.status ===
                                                     "Revision Requested"
                                                   ? "bg-orange-100 text-orange-800"
                                                   : "bg-yellow-100 text-yellow-800"
                                       }`}
                                    >
                                       {submission.status}
                                    </span>
                                 </td>
                                 <td className="px-6 py-4 text-sm text-slate-500">
                                    {new Date(
                                       submission.createdAt,
                                    ).toLocaleDateString()}
                                 </td>
                              </tr>
                           ))
                        ) : (
                           <tr>
                              <td
                                 colSpan="5"
                                 className="px-6 py-12 text-center text-slate-500"
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

// import React, { useState, useEffect, useContext } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { FileText, Clock, CheckCircle, TrendingUp, Eye } from "lucide-react";
// import { AdminContext } from "../../context/AdminContext";

// const ReviewerDashboard = () => {
//    const [stats, setStats] = useState({
//       total: 0,
//       pending: 0,
//       completed: 0,
//    });

//    const [recentSubmissions, setRecentSubmissions] = useState([]);
//    const [loading, setLoading] = useState(true);

//    const { backendUrl } = useContext(AdminContext);
//    const rtoken = localStorage.getItem("rToken");

//    useEffect(() => {
//       fetchDashboardData();
//       fetchRecentSubmissions();
//    }, []);

//    const fetchDashboardData = async () => {
//       try {
//          const { data } = await axios.get(
//             `${backendUrl}/api/reviewer/dashboard`,
//             {
//                headers: { rtoken },
//             },
//          );

//          if (data.success) {
//             const completedCount =
//                data.stats.accepted +
//                data.stats.rejected +
//                data.stats.revisionRequested;

//             setStats({
//                total: data.stats.total,
//                pending: data.stats.pending,
//                completed: completedCount,
//             });
//          }
//       } catch (error) {
//          console.error("Error fetching dashboard stats:", error);
//          toast.error("Failed to load dashboard statistics");
//       }
//    };

//    const fetchRecentSubmissions = async () => {
//       try {
//          setLoading(true);
//          const { data } = await axios.get(
//             `${backendUrl}/api/reviewer/submissions`,
//             {
//                headers: { rtoken },
//             },
//          );

//          if (data.success) {
//             setRecentSubmissions(data.submissions.slice(0, 5));
//          }
//       } catch (error) {
//          console.error("Error fetching submissions:", error);
//          toast.error("Failed to load recent submissions");
//       } finally {
//          setLoading(false);
//       }
//    };

//    const handleViewAllSubmissions = () => {
//       window.location.href = "/reviewer/submissions";
//    };

//    if (loading) {
//       return (
//          <div className="flex items-center justify-center min-h-screen bg-gray-50">
//             <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-cyan-500"></div>
//          </div>
//       );
//    }

//    return (
//       <div className="min-h-[calc(100vh-5rem)] bg-gray-50 px-7 py-8">
//          <div className="w-full">
//             <div className="mb-8">
//                <h1 className="text-3xl font-bold text-slate-950">
//                   Reviewer Dashboard
//                </h1>
//                <p className="text-slate-500 mt-2">
//                   Overview of your assigned papers
//                </p>
//             </div>

//             {/* Statistics Cards */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//                {/* Assigned */}
//                <div className="bg-white rounded shadow-[0_18px_45px_rgba(15,23,42,0.06)] p-6 ">
//                   <div className="flex items-center justify-between">
//                      <div>
//                         <p className="text-sm text-slate-500 font-semibold uppercase">
//                            Assigned
//                         </p>
//                         <p className="text-3xl font-bold text-slate-950 mt-2">
//                            {stats.total}
//                         </p>
//                      </div>
//                      <FileText className="w-12 h-12 text-blue-500" />
//                   </div>
//                </div>

//                {/* Pending */}
//                <div className="bg-white rounded shadow-[0_18px_45px_rgba(15,23,42,0.06)] p-6 ">
//                   <div className="flex items-center justify-between">
//                      <div>
//                         <p className="text-sm text-slate-500 font-semibold uppercase">
//                            Pending
//                         </p>
//                         <p className="text-3xl font-bold text-slate-950 mt-2">
//                            {stats.pending}
//                         </p>
//                      </div>
//                      <Clock className="w-12 h-12 text-yellow-500" />
//                   </div>
//                </div>

//                {/* Completed */}
//                <div className="bg-white rounded shadow-[0_18px_45px_rgba(15,23,42,0.06)] p-6 ">
//                   <div className="flex items-center justify-between">
//                      <div>
//                         <p className="text-sm text-slate-500 font-semibold uppercase">
//                            Completed
//                         </p>
//                         <p className="text-3xl font-bold text-slate-950 mt-2">
//                            {stats.completed}
//                         </p>
//                      </div>
//                      <CheckCircle className="w-12 h-12 text-green-500" />
//                   </div>
//                </div>
//             </div>

//             {/* Recent Submissions */}
//             <div className="bg-white rounded shadow-[0_18px_45px_rgba(15,23,42,0.06)] overflow-hidden border border-slate-200">
//                <div className="p-6 border-b border-slate-200">
//                   <div className="flex items-center justify-between">
//                      <h2 className="text-2xl font-bold text-slate-950">
//                         Recent Submissions
//                      </h2>
//                      <button
//                         onClick={handleViewAllSubmissions}
//                         className="text-cyan-600 hover:text-cyan-700 font-medium text-sm flex items-center gap-1"
//                      >
//                         View All
//                         <TrendingUp className="w-4 h-4" />
//                      </button>
//                   </div>
//                </div>

//                <div className="overflow-x-auto">
//                   <table className="min-w-full divide-y divide-transparent">
//                      <thead className="bg-white">
//                         <tr>
//                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">
//                               Paper ID
//                            </th>
//                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">
//                               Title
//                            </th>
//                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">
//                               Author
//                            </th>
//                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">
//                               Status
//                            </th>
//                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">
//                               Date
//                            </th>
//                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">
//                               Action
//                            </th>
//                         </tr>
//                      </thead>

//                      <tbody className="bg-white divide-y divide-transparent">
//                         {recentSubmissions.length > 0 ? (
//                            recentSubmissions.map((submission) => (
//                               <tr
//                                  key={submission._id}
//                                  className="hover:bg-gray-50"
//                               >
//                                  <td className="px-6 py-4 font-bold text-slate-700">
//                                     {submission.paperId ?? "-"}
//                                  </td>
//                                  <td className="px-6 py-4 truncate max-w-xs">
//                                     {submission.title || "Untitled"}
//                                  </td>
//                                  <td className="px-6 py-4">
//                                     {submission.user?.name || "N/A"}
//                                  </td>
//                                  <td className="px-6 py-4">
//                                     <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-slate-950">
//                                        {submission.status}
//                                     </span>
//                                  </td>
//                                  <td className="px-6 py-4 text-sm text-slate-500">
//                                     {new Date(
//                                        submission.createdAt,
//                                     ).toLocaleDateString()}
//                                  </td>
//                                  <td className="px-6 py-4">
//                                     <button
//                                        onClick={handleViewAllSubmissions}
//                                        className="p-2 text-cyan-600 hover:bg-cyan-50 rounded-lg"
//                                     >
//                                        <Eye className="w-5 h-5" />
//                                     </button>
//                                  </td>
//                               </tr>
//                            ))
//                         ) : (
//                            <tr>
//                               <td
//                                  colSpan="6"
//                                  className="px-6 py-12 text-center text-slate-500"
//                               >
//                                  No submissions assigned
//                               </td>
//                            </tr>
//                         )}
//                      </tbody>
//                   </table>
//                </div>
//             </div>
//          </div>
//       </div>
//    );
// };

// export default ReviewerDashboard;
