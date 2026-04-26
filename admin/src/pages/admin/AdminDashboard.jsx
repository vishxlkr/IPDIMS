import React, { useContext, useEffect, useState } from "react";
import Loading from "../../components/Loading";
import axios from "axios";
import { toast } from "react-toastify";
import {
   CheckCircle,
   XCircle,
   Clock,
   AlertCircle,
   FileEdit,
   UserCheck,
} from "lucide-react";
import { AdminContext } from "../../context/AdminContext";

const AdminDashboard = () => {
   const [stats, setStats] = useState({
      pendingSubmissions: 0,
      underReviewSubmissions: 0,
      acceptedSubmissions: 0,
      rejectedSubmissions: 0,
      revisionRequestedSubmissions: 0,
      unassignedSubmissions: 0,
   });
   const [recentSubmissions, setRecentSubmissions] = useState([]);
   const [loading, setLoading] = useState(true);

   // const backendUrl = "http://localhost:4000";
   const { backendUrl } = useContext(AdminContext);
   const atoken = localStorage.getItem("aToken");

   useEffect(() => {
      fetchDashboardData();
   }, []);

   const fetchDashboardData = async () => {
      try {
         setLoading(true);
         const headers = { atoken };

         const [usersRes, submissionsRes, reviewersRes] = await Promise.all([
            axios.get(`${backendUrl}/api/admin/users`, { headers }),
            axios.get(`${backendUrl}/api/admin/submissions`, { headers }),
            axios.get(`${backendUrl}/api/admin/all-reviewer`, { headers }),
         ]);

         if (
            usersRes.data.success &&
            submissionsRes.data.success &&
            reviewersRes.data.success
         ) {
            const users = usersRes.data.users || [];
            const submissions = submissionsRes.data.submissions || [];
            const reviewers = reviewersRes.data.reviewers || [];

            setStats({
               pendingSubmissions: submissions.filter(
                  (s) => s.status === "Pending",
               ).length,
               underReviewSubmissions: submissions.filter(
                  (s) => s.status === "Under Review",
               ).length,
               acceptedSubmissions: submissions.filter(
                  (s) => s.status === "Accepted",
               ).length,
               rejectedSubmissions: submissions.filter(
                  (s) => s.status === "Rejected",
               ).length,
               revisionRequestedSubmissions: submissions.filter(
                  (s) => s.status === "Revision Requested",
               ).length,
               unassignedSubmissions: submissions.filter(
                  (s) => !s.reviewers || s.reviewers.length === 0,
               ).length,
            });

            // Sort submissions client-side for "Recent" to prioritize needsAdminAction
            const sortedSubmissions = submissions.sort((a, b) => {
               if (a.needsAdminAction === b.needsAdminAction) {
                  return new Date(b.updatedAt) - new Date(a.updatedAt);
               }
               return a.needsAdminAction ? -1 : 1;
            });
            setRecentSubmissions(sortedSubmissions.slice(0, 5));
         }
      } catch (error) {
         console.error("Error fetching dashboard data:", error);
         toast.error(error.response?.data?.message || "Failed to fetch data");
      } finally {
         setLoading(false);
      }
   };

   const statsData = [
      {
         title: "Pending",
         value: stats.pendingSubmissions,
         icon: Clock,
      },
      {
         title: "Under Review",
         value: stats.underReviewSubmissions,
         icon: AlertCircle,
      },
      {
         title: "Accepted",
         value: stats.acceptedSubmissions,
         icon: CheckCircle,
      },
      {
         title: "Rejected",
         value: stats.rejectedSubmissions,
         icon: XCircle,
      },
      {
         title: "Revision",
         value: stats.revisionRequestedSubmissions,
         icon: FileEdit,
      },
      {
         title: "Unassigned",
         value: stats.unassignedSubmissions,
         icon: UserCheck,
      },
   ];

   if (loading) return <Loading />;

   return (
      <div className="min-h-[calc(100vh-5rem)] bg-gray-50 px-7 py-8">
         <div className="w-full">
            <div className="mb-8">
               <h1 className="text-3xl font-bold text-slate-950">
                  Admin Dashboard
               </h1>
            </div>

            {/* {stat on dashboard} */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
               {statsData.map((item, index) => (
                  <div
                     key={index}
                     className="bg-gray-100 border border-gray-300 px-4 py-3 hover:bg-gray-200 transition-all duration-200"
                  >
                     <div className="flex items-center justify-between">
                        <div>
                           <p className="text-xs text-gray-600">{item.title}</p>
                           <p className="text-xl font-semibold text-gray-900">
                              {item.value}
                           </p>
                        </div>

                        <item.icon className="w-4 h-4 text-gray-500" />
                     </div>
                  </div>
               ))}
            </div>

            <div className="bg-white rounded shadow-[0_18px_45px_rgba(15,23,42,0.06)] border border-slate-200 overflow-hidden">
               <div className="p-6 border-b border-slate-200">
                  <h2 className="text-2xl font-bold text-slate-950">
                     Recent Submissions
                  </h2>
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
                              Date
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
                                    <div className="text-sm text-slate-700">
                                       {submission.author?.name || "N/A"}
                                    </div>
                                    <div className="text-xs text-slate-500">
                                       {submission.author?.email}
                                    </div>
                                 </td>
                                 <td className="px-6 py-4">
                                    <span
                                       className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                          submission.status === "Accepted"
                                             ? "bg-green-100 text-green-800"
                                             : submission.status === "Rejected"
                                               ? "bg-red-100 text-red-800"
                                               : submission.status ===
                                                   "Under Review"
                                                 ? "bg-cyan-100 text-cyan-700"
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
                                 colSpan="4"
                                 className="px-6 py-8 text-center text-slate-500"
                              >
                                 No submissions found
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

export default AdminDashboard;
